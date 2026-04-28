//בס"ד

import { Router } from "express";
import { flow, pipe } from "fp-ts/lib/function";
import { getDb } from "../middleware/db";
import {
  bind,
  bindTo,
  filterOrElse,
  fromEither,
  map,
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
import { isSinglePitScoutTeam } from "../verification/functions";

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
    flatTryCatch(
      (collection) => collection.find(mongofyQuery(req.query)).toArray(),
      () => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: "Error getting forms from collection ",
      }),
    ),
    filterOrElse(isSinglePitScoutTeam, () => ({
      status: StatusCodes.BAD_REQUEST,
      reason:
        "Pit Scouting Error: Forms contain data from multiple different teams.",
    })),
    bindTo("forms"),
    foldResponse(res),
  )();
});
