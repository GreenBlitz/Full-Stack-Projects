//בס"ד

import { Router } from "express";
import { bindTo } from "fp-ts/lib/TaskEither";
import { flatTryCatch, foldResponse, mongofyQuery } from "@repo/flow-utils";
import { StatusCodes } from "http-status-codes";
import { pipe } from "fp-ts/lib/function";
import { getScouterCollection } from "../googleSheets";

export const leaderboardRouter = Router();

leaderboardRouter.get("/", (req, res) =>
  pipe(
    getScouterCollection(),
    flatTryCatch(
      (collection) => collection.find(mongofyQuery(req.query)).toArray(),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `DB Error: ${error}`,
      }),
    ),
    bindTo("competitionScouters"),
    foldResponse(res),
  )(),
);
