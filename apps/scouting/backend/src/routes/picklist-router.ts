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
import { firstElement } from "@repo/array-functions";
import {
  ScoutingForm,
  PicklistStats,
  PicklistGameStats,
  GamePeriod,
  SuperScout,
} from "@repo/scouting_types";
import { processTeam } from "./teams-router";
import { calculateAverageClimbScore } from "../climb/score";
import { getSuperCollection } from "./super-scout-router";
import { processAvarageTeamSuperScouting } from "../superScout/calculations";

export const picklistRouter = Router();

const createPicklistStats: (
  forms: ScoutingForm[],
  superForms: SuperScout[],
) => PicklistStats = (forms, superForms) => ({
  tele: createGamePeriodPicklistStats(forms, "tele"),
  auto: createGamePeriodPicklistStats(forms, "auto"),
  superScouting: processAvarageTeamSuperScouting(
    firstElement(forms).teamNumber,
    superForms,
  ),
});

const createGamePeriodPicklistStats: (
  forms: ScoutingForm[],
  gamePeriod: GamePeriod,
) => PicklistGameStats = (forms, gamePeriod) => {
  const teamData = processTeam(forms);
  return {
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

    map(({ forms, superForms }) => createPicklistStats(forms, superForms)),
    foldResponse(res),
  )(),
);
