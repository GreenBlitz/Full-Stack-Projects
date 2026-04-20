//בס"ד

import { Router } from "express";
import { flow, pipe } from "fp-ts/lib/function";
import { getDb } from "../middleware/db";
import { bind, bindTo, fromEither, map } from "fp-ts/lib/TaskEither";
import { createBodyVerificationPipe, foldResponse } from "@repo/flow-utils";
import { right as rightEither } from "fp-ts/lib/Either";
import { mongofyQuery } from "@repo/flow-utils";
import { PitScout, pitScoutCodec } from "@repo/scouting_types";

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

pitScoutRouter.get("/", async (req, res) => {
  await flow(
    getPitCollection,
    map((collection) => collection.find(mongofyQuery(req.query)).toArray()),
    foldResponse(res),
  )();
});
