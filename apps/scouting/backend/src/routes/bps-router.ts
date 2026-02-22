// בס"ד
import { Router } from "express";
import { getDb } from "../middleware/db";
import { Match, ScoutingForm, TeamedBPS } from "@repo/scouting_types";
import { flow, pipe } from "fp-ts/lib/function";
import { flatMap, map, tryCatch } from "fp-ts/lib/TaskEither";
import { getFormsCollection } from "./forms-router";
import { StatusCodes } from "http-status-codes";

export const bpsRouter = Router();

const getBPSCollection = flow(
  getDb,
  map((db) => db.collection<TeamedBPS>("bps")),
);

const isMatchSame = (match1: Match, match2: Match) =>
  match1.number === match2.number && match1.type === match2.type;

const getAllFormEvents = (form: ScoutingForm) => [
  form.auto.shootEvents,
  form.tele.transitionShift.shootEvents,
  ...form.tele.shifts.map((shift) => shift.shootEvents),
  form.tele.endgameShift,
];

bpsRouter.get("/matches", async (req, res) => {
  await pipe(
    getFormsCollection(),
    flatMap((formsCollection) =>
      pipe(
        getBPSCollection(),
        map((bpsCollection) => ({ formsCollection, bpsCollection })),
      ),
    ),
    flatMap(({ formsCollection, bpsCollection }) =>
      tryCatch(
        async () => ({
          forms: await formsCollection.find().toArray(),
          bpses: await bpsCollection.find().toArray(),
        }),
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Error Getting Items From Collections ${error}`,
        }),
      ),
    ),
    map(({ forms, bpses }) => ({
      games: forms.map((form) => ({
        team: form.teamNumber,
        match: form.match,
        events: getAllFormEvents(form),
      })),
      bpses,
    })),
    map(({ games, bpses }) => ),
  );
});
