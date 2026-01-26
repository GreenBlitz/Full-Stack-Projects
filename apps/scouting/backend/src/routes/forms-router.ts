// בס"ד

import { Router } from "express";
import { flow } from "fp-ts/lib/function";
import { getDb } from "../middleware/db";
import { fold, map } from "fp-ts/lib/TaskEither";
import type { ScoutingForm } from "@repo/scouting_types";
import { StatusCodes } from "http-status-codes";

export const formsRouter = Router();

const getCollection = flow(
  getDb,
  map((db) => db.collection<ScoutingForm>("forms")),
);

formsRouter.get("/", (req, res) =>
  flow(
    getCollection,
    map((collection) => collection.find().toArray()),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (forms) => async () =>
        res.status(StatusCodes.OK).json({ forms: await forms }),
    ),
  )(),
);
