// בס"ד

import { type Request, Router } from "express";
import { flow, pipe } from "fp-ts/lib/function";
import { getDb } from "../middleware/db";
import {
  filterOrElse,
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
import type { Type } from "io-ts";
import * as t from "io-ts";
import { isEmpty } from "@repo/array-functions";

export const formsRouter = Router();

const getCollection = flow(
  getDb,
  map((db) => db.collection<ScoutingForm>("forms")),
);

formsRouter.get("/", async (req, res) => {
  await pipe(
    getCollection(),
    map((collection) => collection.find(mongofyQuery(req.query)).toArray()),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (forms) => async () =>
        res.status(StatusCodes.OK).json({ forms: await forms }),
    ),
  )();
});

const getCollectionAndBody = <U>(req: Request, codec: Type<U, unknown>) =>
  pipe(
    getCollection(),
    flatMap((collection) =>
      pipe(
        right(req),
        createBodyVerificationPipe(codec),
        fromEither,
        map((body) => ({ collection, body })),
      ),
    ),
  );

formsRouter.post("/single", async (req, res) => {
  await pipe(
    getCollectionAndBody(req, scoutingFormCodec),
    map(({ collection, body }) => collection.insertOne(body)),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (result) => async () =>
        res.status(StatusCodes.OK).json({ result: await result }),
    ),
  )();
});

formsRouter.post("/multiple", async (req, res) => {
  await pipe(
    getCollectionAndBody(req, t.array(scoutingFormCodec)),
    filterOrElse(
      ({ body }) => isEmpty(body),
      () => ({ status: StatusCodes.BAD_REQUEST, reason: `Empty Form Array` }),
    ),
    map(({ collection, body }) => collection.insertMany(body)),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (result) => async () =>
        res.status(StatusCodes.OK).json({ result: await result }),
    ),
  )();
});
