// בס"ד

import { Router } from "express";
import { flow, pipe } from "fp-ts/lib/function";
import { getDb } from "../middleware/db";
import {
  flatMap,
  fold,
  fromEither,
  map,
} from "fp-ts/lib/TaskEither";
import { scoutingFormCodec, type ScoutingForm } from "@repo/scouting_types";
import { StatusCodes } from "http-status-codes";
import { createBodyVerificationPipe } from "../middleware/verification";
import { right } from "fp-ts/lib/Either";
import { mongofyQuery } from "../middleware/query";
import * as t from "io-ts";

export const formsRouter = Router();

export const getFormsCollection = flow(
  getDb,
  map((db) => db.collection<ScoutingForm>("forms")),
);

formsRouter.get("/", async (req, res) => {
  await pipe(
    getFormsCollection(),
    map((collection) => collection.find(mongofyQuery(req.query)).toArray()),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (forms) => async () =>
        res.status(StatusCodes.OK).json({ forms: await forms }),
    ),
  )();
});

const combinedCodec = t.union([scoutingFormCodec, t.array(scoutingFormCodec)]);

formsRouter.post("/", async (req, res) => {
  await pipe(
    getFormsCollection(),
    flatMap((collection) =>
      pipe(
        right(req),
        createBodyVerificationPipe(combinedCodec),
        fromEither,
        map((body) => ({ collection, body })),
      ),
    ),
    map(({ collection, body }) =>
      Array.isArray(body)
        ? collection.insertMany(body)
        : collection.insertOne(body),
    ),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (result) => async () =>
        res.status(StatusCodes.OK).json({ result: await result }),
    ),
  )();
});
