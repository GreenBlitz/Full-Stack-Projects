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
import type { ScoutingForm, TinderStats } from "@repo/scouting_types";
import {
  calcAverageGeneralFuelData,
  formsToFuelData,
} from "../fuel/fuel-general";
import { findMaxClimbLevel } from "../climb/calculations";
import { findTimesStuckOnBump } from "../movement/stats";
import { isSingleTeam } from "../verification/functions";

export const tinderRouter = Router();

const createTinder: (ScoutingForm) => TinderStats = (
  forms: ScoutingForm[],
) => ({
  fuel: calcAverageGeneralFuelData(Object.values(formsToFuelData(forms))),
  climb: {
    maxClimbLevel: findMaxClimbLevel(forms),
  },
  movement: {
    stuckOnBump: findTimesStuckOnBump(forms),
  },
});

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

    filterOrElse(isSingleTeam, () => ({
      status: StatusCodes.BAD_REQUEST,
      reason:
        "Tinder Team Error: Forms contain data from multiple different teams.",
    })),

    map(createTinder),

    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (teamTinderStats) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ teamTinderStats })),
    ),
  )(),
);
