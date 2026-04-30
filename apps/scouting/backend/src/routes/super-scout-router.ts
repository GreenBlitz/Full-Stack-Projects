// בס"ד
import { Router } from "express";
import { flow, pipe } from "fp-ts/lib/function";
import { getDb } from "../middleware/db";
import { map, fold, bindTo, fromEither, bind } from "fp-ts/lib/TaskEither";
import { SuperScout, superScoutCodec } from "@repo/scouting_types";
import { flatTryCatch, foldResponse, mongofyQuery } from "@repo/flow-utils";
import { StatusCodes } from "http-status-codes";
import { right as rightEither } from "fp-ts/lib/Either";
import { createBodyVerificationPipe } from "@repo/flow-utils";

export const superScoutRouter = Router();

export const getSuperCollection = flow(
  getDb,
  map((db) => db.collection<SuperScout>("super")),
);

superScoutRouter.get("/", async (req, res) => {
  await flow(
    getSuperCollection,
    flatTryCatch(
      (collection) => collection.find(mongofyQuery(req.query)).toArray(),
      () => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: "Error Getting Forms From Collection",
      }),
    ),
    bindTo("forms"),
    foldResponse(res),
  )();
});

superScoutRouter.post("/", async (req, res) => {
  await pipe(
    rightEither(req),
    createBodyVerificationPipe(superScoutCodec),
    fromEither,
    bindTo("superScout"),
    bind("collection", getSuperCollection),
    flatTryCatch(
      ({ superScout, collection }) => collection.insertOne(superScout),
      () => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: "Error Inserting Forms To Collection ",
      }),
    ),
    bindTo("result"),
    foldResponse(res),
  )();
});
