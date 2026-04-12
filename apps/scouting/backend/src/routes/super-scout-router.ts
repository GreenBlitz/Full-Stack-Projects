// בס"ד
import { Router } from "express";
import { flow, pipe } from "fp-ts/lib/function";
import { getDb } from "../middleware/db";
import { map, fold, bindTo, fromEither, bind } from "fp-ts/lib/TaskEither";
import { SuperScout, superScoutCodec } from "@repo/scouting_types";
import { mongofyQuery } from "@repo/flow-utils";
import { StatusCodes } from "http-status-codes";
import { right as rightEither } from "fp-ts/lib/Either";
import { createBodyVerificationPipe } from "@repo/flow-utils";

export const superScoutRouter = Router();

export const getSuperCollection = flow(
  getDb,
  map((db) => db.collection<SuperScout>("/super")),
);

superScoutRouter.get("/", async (req, res) => {
  await flow(
    getSuperCollection,
    map((collection) => collection.find(mongofyQuery(req.query)).toArray()),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (forms) => async () =>
        res.status(StatusCodes.OK).json({ forms: await forms }),
    ),
  )();
});

superScoutRouter.post("/", async (req, res) => {
  await pipe(
    rightEither(req),
    createBodyVerificationPipe(superScoutCodec),
    fromEither,
    bindTo("superScout"),
    bind("collection", getSuperCollection),
    map(({ superScout, collection }) => collection.insertOne(superScout)),

    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (result) => async () =>
        res.status(StatusCodes.OK).json({ result: await result }),
    ),
  )();
});
