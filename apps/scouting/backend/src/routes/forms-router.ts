// בס"ד

import { Router } from "express";
import { flow, pipe } from "fp-ts/lib/function";
import { getDb } from "../middleware/db";
import {
  bind,
  bindTo,
  filterOrElse,
  fold,
  fromEither,
  map,
} from "fp-ts/lib/TaskEither";
import { scoutingFormCodec, type ScoutingForm } from "@repo/scouting_types";
import { StatusCodes } from "http-status-codes";
import {
  createBodyVerificationPipe,
  foldResponse,
  flatTryCatch,
} from "@repo/flow-utils";
import { right as rightEither } from "fp-ts/lib/Either";
import { mongofyQuery } from "@repo/flow-utils";
import * as t from "io-ts";
import { isEmpty } from "@repo/array-functions";

export const formsRouter = Router();

export const getFormsCollection = flow(
  getDb,
  map((db) => db.collection<ScoutingForm>("forms")),
);

formsRouter.get("/", async (req, res) => {
  await pipe(
    getFormsCollection(),
    flatTryCatch(
      (collection) => collection.find(mongofyQuery(req.query)).toArray(),
      () => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: "Error Inserting Forms To Collection ",
      }),
    ),
    bindTo("forms"),
    foldResponse(res),
  )();
});

const combinedPostCodec = t.union([
  scoutingFormCodec,
  t.array(scoutingFormCodec),
]);

formsRouter.post("/", async (req, res) => {
  await pipe(
    rightEither(req),
    createBodyVerificationPipe(combinedPostCodec),
    fromEither,
    map((combinedBody) =>
      Array.isArray(combinedBody) ? combinedBody : [combinedBody],
    ),
    filterOrElse(
      (forms) => !isEmpty(forms),
      () => ({
        status: StatusCodes.BAD_REQUEST,
        reason: `Inserted Empty Form Array`,
      }),
    ),
    bindTo("forms"),
    bind("collection", getFormsCollection),
    flatTryCatch(
      async ({ collection, forms }) => {
        await collection.deleteMany({
          $or: forms.map((form) => ({
            scouterName: form.scouterName,
            "match.number": form.match.number,
            "match.type": form.match.type,
            competition: form.competition,
            teamNumber: form.teamNumber,
          })),
        });
        return collection.insertMany(forms);
      },
      () => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: "Error Inserting Forms To Collection ",
      }),
    ),
    bindTo("result"),
    foldResponse(res),
  )();
});

formsRouter.get("/teams", async (req, res) => {
  await pipe(
    getFormsCollection(),
    flatTryCatch(
      (collection) =>
        collection
          .find(mongofyQuery({ "match.type": "qualification" }))
          .toArray(),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `DB Error: ${error}`,
      }),
    ),
    map((forms) => forms.map((form) => form.teamNumber)),
    map((numbers) => [...new Set(numbers)]),
    bindTo("teamNumbers"),
    foldResponse(res),
  )();
});
