//בס"ד

import { Router } from "express";
import { getBeeScoutCollection } from "../googleSheets";
import { pipe } from "fp-ts/lib/function";
import { mongofyQuery, flatTryCatch, foldResponse } from "@repo/flow-utils";
import { StatusCodes } from "http-status-codes";

export const teamPageRouter = Router();

teamPageRouter.get("/", async (req, res) => {
  await pipe(
    getBeeScoutCollection(),
    flatTryCatch(
      (Collection) => Collection.find(mongofyQuery(req.query)).toArray(),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `error fetching data from DB in teamPage ${error}`,
      }),
    ),
  )();
});

getBeeScoutCollection;
