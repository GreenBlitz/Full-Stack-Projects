//בס"ד

import { Router } from "express";
import { flow, pipe } from "fp-ts/lib/function";
import { getDb } from "../middleware/db";
import { bind, bindTo, fromEither, map } from "fp-ts/lib/TaskEither";
import {
  createBodyVerificationPipe,
  flatTryCatch,
  foldResponse,
} from "@repo/flow-utils";
import { right as rightEither } from "fp-ts/lib/Either";
import { mongofyQuery } from "@repo/flow-utils";
import { PitScout, pitScoutCodec } from "@repo/scouting_types";
import { StatusCodes } from "http-status-codes";
import * as t from "io-ts";

export const pitScoutRouter = Router();

export const getPitCollection = flow(
  getDb,
  map((db) => db.collection<PitScout>("pit")),
);

pitScoutRouter.post("/", async (req, res) => {
  await pipe(
    rightEither(req),
    createBodyVerificationPipe(pitScoutCodec),
    fromEither,
    bindTo("pitScout"),
    bind("collection", getPitCollection),
    map(({ pitScout, collection }) => collection.insertOne(pitScout)),
    foldResponse(res),
  )();
});

pitScoutRouter.patch("/", async (req, res) => {
  await pipe(
    rightEither(req),
    createBodyVerificationPipe(pitScoutCodec),
    fromEither,
    bindTo("pitScout"),
    bind("collection", getPitCollection),
    flatTryCatch(
      ({ pitScout, collection }) => {
        const { _id, ...pitScoutFields } = pitScout as PitScout & {
          _id?: unknown;
        };

        return collection.updateOne(
          { teamNumber: pitScout.teamNumber },
          { $set: pitScoutFields },
        );
      },
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Error Updating Pit Scout: ${error}`,
      }),
    ),
    foldResponse(res),
  )();
});

pitScoutRouter.delete("/", async (req, res) => {
  await pipe(
    rightEither(req),
    createBodyVerificationPipe(t.type({ teamNumber: t.number })),
    fromEither,
    bindTo("pitScout"),
    bind("collection", getPitCollection),
    flatTryCatch(
      ({ collection, pitScout }) =>
        collection.deleteOne({ teamNumber: pitScout.teamNumber }),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Error Deleting Pit Scout: ${error}`,
      }),
    ),
    foldResponse(res),
  )();
});

pitScoutRouter.get("/", async (req, res) => {
  await pipe(
    getPitCollection(),
    flatTryCatch(
      (collection) => collection.find(mongofyQuery(req.query)).toArray(),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Error Fetching Forms Pit Scout: ${error}`,
      }),
    ),
    foldResponse(res),
  )();
});
