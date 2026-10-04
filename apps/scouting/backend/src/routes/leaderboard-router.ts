//בס"ד

import { Router } from "express";
import { bindTo, map } from "fp-ts/lib/TaskEither";
import { flatTryCatch, foldResponse, mongofyQuery } from "@repo/flow-utils";
import { StatusCodes } from "http-status-codes";
import { pipe } from "fp-ts/lib/function";
import { getBeeScouterCollection } from "../googleSheets";

export const leaderboardRouter = Router();

leaderboardRouter.get("/", (req, res) =>
  pipe(
    getBeeScouterCollection(),
    flatTryCatch(
      (collection) => collection.find(mongofyQuery(req.query)).toArray(),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `DB Error: ${error}`,
      }),
    ),
    map((scouters) => ({ scouters })),
    bindTo("competitionScouters"),
    foldResponse(res),
  )(),
);
