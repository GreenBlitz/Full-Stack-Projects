//בס"ד

import { Router } from "express";
import { getFormsCollection } from "./forms-router";
import {
  flatMap,
  filterOrElse,
  map,
  bindTo,
  bind,
  tryCatch,
} from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { mongofyQuery, flatTryCatch, foldResponse } from "@repo/flow-utils";
import { StatusCodes } from "http-status-codes";
import { isSingleTeam } from "../verification/functions";
import { getTeamBPSes } from "./bps-router";
import { firstElement } from "@repo/array-functions";
import {
  BPS,
  ScoutingForm,
  PicklistStats,
  PicklistGameStats,
  GamePeriod,
  SuperScout,
} from "@repo/scouting_types";
import {
  calcAverageGeneralFuelData,
  calculateAverageScoredFuel,
  formsToFuelData,
} from "../fuel/fuel-general";
import { splitByDistances } from "../fuel/distance-split";
import { processTeam } from "./teams-router";
import { calculateAverageClimbScore } from "../climb/score";
import { getSuperCollection } from "./super-scout-router";
import { processAvarageTeamSuperScouting } from "../superScout/calculations";

export const picklistRouter = Router();

const createPicklistStats: (
  forms: ScoutingForm[],
  bpses: Record<string, BPS[]>,
  superForms: SuperScout[],
) => PicklistStats = (forms, bpses, superForms) => ({
  teleop: createGamePeriodPicklistStats(forms, bpses, "teleop"),
  auto: createGamePeriodPicklistStats(forms, bpses, "auto"),
  superScouting: processAvarageTeamSuperScouting(
    firstElement(forms).teamNumber,
    superForms,
  ),
});

const CLOSE_FUEL_DISTANCE = 150;
const MEDIUM_FUEL_DISTANCE = 300;
const FAR_FUEL_DISTANCE = 2000;
const createGamePeriodPicklistStats: (
  forms: ScoutingForm[],
  bpses: Record<string, BPS[]>,
  gamePeriod: GamePeriod,
) => PicklistGameStats = (forms, bpses, gamePeriod) => {
  const teamData = processTeam(bpses[firstElement(forms).teamNumber], forms);
  return {
    fuel: calculateAverageScoredFuel(
      forms,
      gamePeriod,
      bpses[firstElement(forms).teamNumber],
    ),
    closeFuel:
      teamData[gamePeriod].accuracy[CLOSE_FUEL_DISTANCE].amount / forms.length,
    mediumFuel:
      teamData[gamePeriod].accuracy[MEDIUM_FUEL_DISTANCE].amount / forms.length,
    farFuel:
      teamData[gamePeriod].accuracy[FAR_FUEL_DISTANCE].amount / forms.length,
    climb: calculateAverageClimbScore(
      teamData.auto.climbs.map((currentClimb) => currentClimb.level),
      gamePeriod == "auto",
    ),
  };
};

picklistRouter.get("/", (req, res) =>
  pipe(
    getFormsCollection(),
    flatTryCatch(
      (collection) => collection.find(mongofyQuery(req.query)).toArray(),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `DB Error: ${error}`,
      }),
    ),
    filterOrElse(isSingleTeam, () => ({
      status: StatusCodes.BAD_REQUEST,
      reason: "Picklist: Forms contain data from multiple different teams.",
    })),
    bindTo("forms"),
    bind("bpsData", ({ forms }) =>
      getTeamBPSes({ [firstElement(forms).teamNumber]: forms }),
    ),

    bind("superForms", () =>
      pipe(
        getSuperCollection(),
        flatMap((collection) =>
          tryCatch(
            () => collection.find().toArray(),
            (error) => ({
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              reason: `SuperScout DB Error: ${error}`,
            }),
          ),
        ),
      ),
    ),

    map(({ forms, bpsData, superForms }) => {
      const { teamNumber } = firstElement(forms);
      const teamBpsResult = bpsData[teamNumber];

      return createPicklistStats(
        forms,
        {
          [teamNumber]: teamBpsResult.bpses,
        },
        superForms,
      );
    }),
    foldResponse(res),
  )(),
);
