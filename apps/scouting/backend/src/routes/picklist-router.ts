//בס"ד

import { Request, Router } from "express";
import { flow, pipe } from "fp-ts/lib/function";
import { map, bind, right, fromEither, bindTo } from "fp-ts/lib/TaskEither";
import {
  createBodyVerificationPipe,
  createLog,
  flatTryCatch,
  foldResponse,
} from "@repo/flow-utils";
import { getTotalGeneralData } from "./general-router";
import { getDb } from "../middleware/db";
import { StatusCodes } from "http-status-codes";
import { GeneralBeeData, GeneralTeamBeeData } from "@repo/scouting_types";
import { right as rightEither } from "fp-ts/lib/Either";
import * as t from "io-ts";

export const picklistRouter = Router();

const picklistCodec = t.type({ name: t.string, list: t.array(t.string) });
type Picklist = t.TypeOf<typeof picklistCodec>;

export const getPicklistCollection = flow(
  getDb,
  map((db) => db.collection<Picklist>("picklist")),
);

const createNewPickList = (data: GeneralBeeData, name: string): Picklist => ({
  name,
  list: Object.entries(data)
    .map(([team, data]) => ({
      team,
      data,
    }))
    .sort(
      (teamA, teamB) => teamB.data.full.fuelScored - teamA.data.full.fuelScored,
      //sorts from highest score to lowest
    )
    .map(({ team }) => team),
});

picklistRouter.get("/:picklist", async (req, res) => {
  await pipe(
    getTotalGeneralData(),
    bind("picklistCollection", getPicklistCollection),
    bind("name", () => right(req.params.picklist)),
    flatTryCatch(
      async ({ generalData, picklistCollection, name }) => ({
        generalData,
        picklist:
          (await picklistCollection.findOne({ name })) ??
          createNewPickList(generalData, name),
      }),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Error Getting List From DB: ${error}`,
      }),
    ),
    map(({ generalData, picklist }) => ({
      name: picklist.name,
      list: picklist.list.map((team) => generalData[team]),
    })),
    foldResponse(res),
  )();
});

picklistRouter.post("/", async (req, res) => {
  await pipe(
    getPicklistCollection(),
    bindTo("picklistCollection"),
    bind("picklist", () =>
      pipe(
        rightEither(req),
        createBodyVerificationPipe(picklistCodec),
        fromEither,
      ),
    ),
    flatTryCatch(
      ({ picklist, picklistCollection }) =>
        picklistCollection.replaceOne({ name: picklist.name }, picklist, {
          upsert: true, //makes it add the picklist if it cant find one with the same name
        }),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Error inserting into DB ${error}`,
      }),
    ),
    foldResponse(res),
  )();
});
