//בס"ד

import { Router } from "express";
import { getFormsCollection } from "./forms-router";
import { pipe } from "fp-ts/lib/function";
import {
  flatMap,
  left,
  map,
  right,
  tryCatch,
  fold,
  filterOrElse,
} from "fp-ts/lib/TaskEither";
import { mongofyQuery } from "../middleware/query";
import { StatusCodes } from "http-status-codes";
import { firstElement, isEmpty } from "@repo/array-functions";
import { calculateAverageScoredFuel } from "../fuel/fuel-general";
import {
  findMaxClimbLevel,
  findTimesClimbedInAuto,
  findTimesClimbedToLevel,
  findTimesClimbedToLevels,
} from "../climb/calculations";
import { isSingleTeam } from "../verification/functions";

export const compareRouter = Router();

compareRouter.get("/", async (req, res) => {
  await pipe(
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
      reason: "Compare: Forms contain data from multiple different teams.",
    })),

    map((teamForms) => ({
      teamNumber: firstElement(teamForms).teamNumber,
      averageFuel: {
        averageFuelInGame: calculateAverageScoredFuel(teamForms, "fullGame"),
        averageFuelInAuto: calculateAverageScoredFuel(teamForms, "auto"),
      },
      climb: {
        maxClimbLevel: findMaxClimbLevel(teamForms),
        timesClimbedToMax: findTimesClimbedToLevel(
          teamForms,
          findMaxClimbLevel(teamForms),
        ),
        timesClimbedInAuto: findTimesClimbedInAuto(teamForms),
        timesClimbedToLevels: findTimesClimbedToLevels(teamForms),
      },
    })),

    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (teamCompareData) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ teamCompareData })),
    ),
  )();
});
