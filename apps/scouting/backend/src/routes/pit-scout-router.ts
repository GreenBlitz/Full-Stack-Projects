//בס"ד

import { Router } from "express";
import { flow, pipe } from "fp-ts/lib/function";
import { getDb } from "../middleware/db";
import {
  bind,
  bindTo,
  fromEither,
  map,
  chain,
  tryCatch,
} from "fp-ts/lib/TaskEither";
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
const MONGODB_DUPLICATE_KEY_ERROR = 11000;

export const getPitCollection = flow(
  getDb,
  map((db) => db.collection<PitScout>("pit")),
  chain((collection) =>
    // create index for teamNumber to ensure uniqueness
    pipe(
      tryCatch(
        () => collection.createIndex({ teamNumber: 1 }, { unique: true }),
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Error creating index for pit scout collection: ${error}`,
        }),
      ),
      map(() => collection),
    ),
  ),
);

const isDuplicateKeyError = (error: unknown): boolean => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === MONGODB_DUPLICATE_KEY_ERROR
  );
};

pitScoutRouter.post("/", async (req, res) => {
  await pipe(
    rightEither(req),
    createBodyVerificationPipe(pitScoutCodec),
    fromEither,
    bindTo("pitScout"),
    bind("collection", getPitCollection),
    flatTryCatch(
      ({ pitScout, collection }) => collection.insertOne(pitScout),
      (error) => {
        const isDuplicate = isDuplicateKeyError(error);

        return {
          status: isDuplicate
            ? StatusCodes.CONFLICT
            : StatusCodes.INTERNAL_SERVER_ERROR,
          reason: isDuplicate
            ? `A pit scout form already exists for team ${req.body.teamNumber}.`
            : `Error Creating Pit Scout: ${error}`,
        };
      },
    ),
    foldResponse(res),
  )();
});

pitScoutRouter.put("/", async (req, res) => {
  await pipe(
    rightEither(req),
    createBodyVerificationPipe(pitScoutCodec),
    fromEither,
    bindTo("pitScout"),
    bind("collection", getPitCollection),
    map(({ pitScout, collection }) => ({
      collection,
      pitScout: (({ _id, ...pitScoutFields }) => pitScoutFields)(
        pitScout as PitScout & { _id?: unknown },
      ),
    })),
    flatTryCatch(
      ({ pitScout, collection }) =>
        collection.updateOne(
          { teamNumber: pitScout.teamNumber },
          { $set: pitScout },
        ),
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
