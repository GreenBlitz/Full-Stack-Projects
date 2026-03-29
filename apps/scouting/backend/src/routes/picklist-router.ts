//בס"ד

import { Router } from "express";
import { getFormsCollection } from "./forms-router";
import { flatMap, filterOrElse, map, bindTo } from "fp-ts/lib/TaskEither";
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
} from "@repo/scouting_types";
import { calculateAverageScoredFuel } from "../fuel/fuel-general";

export const picklistRouter = Router();

const createPicklistStats: (
  forms: ScoutingForm[],
  bpses: Record<string, BPS[]>,
) => PicklistStats = (forms, bpses) => {};

const createGamePeriodPicklistStats: (
  forms: ScoutingForm[],
  bpses: Record<string, BPS[]>,
  gamePeriod: GamePeriod,
) => PicklistGameStats = (forms, bpses, gamePeriod) => (
    {
        fuel: calculateAverageScoredFuel(forms, gamePeriod, bpses),
        closeFuel: 
    }
);

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
      reason:
        "Picklist Error: Forms contain data from multiple different teams.",
    })),
    flatMap((forms) =>
      getTeamBPSes({ [firstElement(forms).teamNumber]: forms }),
    ),
    map((teams) => {
      const firstTeam = firstElement(Object.values(teams));
      const teamNumber = firstElement(firstTeam.forms).teamNumber;

      return createPicklistStats(firstTeam.forms, {
        [teamNumber]: firstTeam.bpses,
      });
    }),
    bindTo("TeamPicklistStats"),
    foldResponse(res),
  )(),
);
