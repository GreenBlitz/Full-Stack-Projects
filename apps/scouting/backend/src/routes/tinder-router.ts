//בס"ד

import { Router } from "express";
import { pipe } from "fp-ts/lib/function";
import { getFormsCollection } from "./forms-router";
import {
  flatMap,
  tryCatch,
  filterOrElse,
  map,
  fold,
} from "fp-ts/lib/TaskEither";
import { mongofyQuery } from "../middleware/query";
import { StatusCodes } from "http-status-codes";
import { calculateSum, firstElement, isEmpty } from "@repo/array-functions";
import type { ScoutingForm, TinderStats } from "@repo/scouting_types";
import { calcAverageGeneralFuelData, formsToFuelData } from "./general-router";
import { findMaxClimbLevel } from "./compare-router";

export const tinderRouter = Router();

const INITIAL_COUNTER_VALUE = 0;
const INCREMENT = 1;

export const findTimesStuckOnBump = (forms: ScoutingForm[]) => {
  return calculateSum(forms, (form) =>
    !form.tele.movement.bumpStuck ? INCREMENT : INITIAL_COUNTER_VALUE,
  );
};

const createTinder = (forms: ScoutingForm[]) => {
  const tinderTeamStats: TinderStats = {
    fuel: calcAverageGeneralFuelData(Object.values(formsToFuelData(forms))),
    climb: {
      maxClimbLevel: findMaxClimbLevel(forms),
    },
    movement: {
      stuckOnBump: findTimesStuckOnBump(forms),
    },
  };
  return tinderTeamStats;
};

tinderRouter.get("/team", (req, res) =>
  pipe(
    getFormsCollection(),
    flatMap((collection) =>
      tryCatch(
        () => collection.find(mongofyQuery(req.query)).toArray(),
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `DB Error: ${error}`,
        }),
      ),
    ),

    filterOrElse(
      (forms: ScoutingForm[]) => {
        if (isEmpty(forms)) return true;
        const firstTeam = firstElement(forms).teamNumber;
        return forms.every((form) => form.teamNumber === firstTeam);
      },
      () => ({
        status: StatusCodes.BAD_REQUEST,
        reason:
          "Tinder Team Error: Forms contain data from multiple different competitions.",
      }),
    ),

    map((forms) => createTinder(forms)),

    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (teamTinderStats) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ teamTinderStats })),
    ),
  )(),
);
