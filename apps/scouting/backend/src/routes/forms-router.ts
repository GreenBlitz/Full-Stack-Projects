// בס"ד

import { Router } from "express";
import { flow, pipe } from "fp-ts/lib/function";
import { getDb } from "../middleware/db";
import { flatMap, fold, fromEither, map } from "fp-ts/lib/TaskEither";
import { scoutingFormCodec, type ScoutingForm } from "@repo/scouting_types";
import { StatusCodes } from "http-status-codes";
import {
  createBodyVerificationPipe,
  createTypeCheckingEndpointFlow,
} from "../middleware/verification";
import { left, right } from "fp-ts/lib/Either";

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

formsRouter.post("/single", (req, res) =>
  flow(
    getCollection,
    flatMap((collection) =>
      pipe(
        right(req),
        createBodyVerificationPipe(scoutingFormCodec),
        fromEither,
        map((form) => ({ collection, form })),
      ),
    ),
    map(({ collection, form }) => collection.insertOne(form)),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (result) => async () =>
        res.status(StatusCodes.OK).json({ result: await result }),
    ),
  ),
);
