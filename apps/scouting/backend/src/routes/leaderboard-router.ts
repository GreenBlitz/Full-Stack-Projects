//בס"ד

import { Router } from "express";
import { getFormsCollection } from "./forms-router";
import { flatMap, tryCatch } from "fp-ts/lib/Either";
import { mongofyQuery } from "../middleware/query";
import { StatusCodes } from "http-status-codes";
import { pipe } from "fp-ts/lib/function";


export const leaderboardRouter = Router();

leaderboardRouter.get("/", (req, res) => {
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
  );
});
