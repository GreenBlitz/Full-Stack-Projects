// בס"ד

import { Router } from "express";
import { pipe } from "fp-ts/lib/function";
import { createBodyVerificationPipe } from "../middleware/verification";
import { forecastProps } from "@repo/scouting_types";
import { right } from "fp-ts/lib/Either";
import { getFormsCollection } from "./forms-router";
import { flatMap, fromEither, map, tryCatch } from "fp-ts/lib/TaskEither";
import { StatusCodes } from "http-status-codes";

export const forecastRouter = Router();

const computeForecast = () => {
  console.log("");
};

forecastRouter.post("/", async (req, res) => {
  await pipe(
    right(req),
    createBodyVerificationPipe(forecastProps),
    fromEither,
    flatMap((body) =>
      pipe(
        getFormsCollection(),
        map((collection) => ({ collection, body })),
      ),
    ),
    flatMap(({ collection, body }) =>
      tryCatch(
        async () => ({
          redAlliance: await collection
            .find({
              teamNumber: { $in: body.redAlliance },
            })
            .toArray(),
          blueAlliance: await collection
            .find({
              teamNumber: { $in: body.blueAlliance },
            })
            .toArray(),
        }),
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Error getting teams from DB: ${error}`,
        }),
      ),
    ),
  )();
});
