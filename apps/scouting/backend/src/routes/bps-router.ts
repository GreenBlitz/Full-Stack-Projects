// בס"ד
import { Router } from "express";
import { getDb } from "../middleware/db";
import {
  BPS,
  BPSBlueprint,
  bpsCodec,
  Interval,
  Match,
  ScoutingForm,
  TeamBPS,
} from "@repo/scouting_types";
import { flow, pipe } from "fp-ts/lib/function";
import {
  ApplicativePar,
  ApplyPar,
  bind,
  bindTo,
  filterOrElse,
  flatMap,
  fold,
  fromEither,
  map,
  orElse,
  right,
  TaskEither,
  tryCatch,
} from "fp-ts/lib/TaskEither";
import { getFormsCollection } from "./forms-router";
import { StatusCodes } from "http-status-codes";
import { firstElement, lastElement, mapObject } from "@repo/array-functions";
import { groupBy } from "fp-ts/lib/NonEmptyArray";
import {
  createBodyVerificationPipe,
  EndpointError,
} from "../middleware/verification";
import { right as rightEither } from "fp-ts/lib/Either";
import { mapWithIndex, sequence, traverse } from "fp-ts/lib/Record";
import { sequenceS } from "fp-ts/lib/Apply";
import { reduce } from "fp-ts/lib/ReadonlyArray";

export const bpsRouter = Router();

const getBPSCollection = flow(
  getDb,
  map((db) => db.collection<TeamBPS>("bps")),
);

const isMatchSame = (match1: Match, match2: Match) =>
  match1.number === match2.number && match1.type === match2.type;

const doIntervalsOverlap = (interval1: Interval, interval2: Interval) =>
  (interval1.start >= interval2.start && interval1.start <= interval2.end) ||
  (interval2.start >= interval1.start && interval2.start <= interval1.end);

const getAllFormEvents = (form: ScoutingForm) => [
  ...form.auto.shootEvents,
  ...form.tele.transitionShift.shootEvents,
  ...form.tele.shifts.flatMap((shift) => shift.shootEvents),
  ...form.tele.endgameShift.shootEvents,
];

bpsRouter.get("/matches", async (req, res) => {
  await pipe(
    getFormsCollection(),
    bindTo("formsCollection"),
    bind("bpsCollection", getBPSCollection),
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
    map(({ games, bpses }) =>
      games.map((game) => {
        const teamedBPS = bpses.find((bps) => bps.team === game.team);
        if (!teamedBPS) {
          return game;
        }

        const bpsGame = teamedBPS.bpses.find((bpsScout) =>
          isMatchSame(bpsScout.match, game.match),
        );
        if (!bpsGame) {
          return game;
        }

        const newEvents = game.events.filter(
          (event) =>
            !bpsGame.events.some((bpsEvent) =>
              doIntervalsOverlap(event.interval, {
                start: firstElement(bpsEvent.shoot),
                end: lastElement(bpsEvent.shoot),
              }),
            ),
        );

        return { ...game, events: newEvents };
      }),
    ),
    map(groupBy((game) => game.team.toString())),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (teamGames) => () =>
        Promise.resolve(
          res.status(StatusCodes.OK).json({ teamGames } satisfies BPSBlueprint),
        ),
    ),
  )();
});

bpsRouter.post("/", async (req, res) => {
  await pipe(
    rightEither(req),
    createBodyVerificationPipe(bpsCodec),
    fromEither,
    bindTo("bps"),
    bind("bpsCollection", getBPSCollection),
    flatMap(({ bpsCollection, bps }) =>
      tryCatch(
        async () => {
          const teamEntry = await bpsCollection.findOne({ team: bps.team });
          if (!teamEntry) {
            return await bpsCollection.insertOne({
              bpses: [bps],
              team: bps.team,
            });
          }

          const newTeamEntry = {
            team: teamEntry.team,
            bpses: [...teamEntry.bpses, bps],
          };
          return await bpsCollection.replaceOne(
            { _id: teamEntry._id },
            newTeamEntry,
          );
        },
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Error Replacing Team Value: ${error}`,
        }),
      ),
    ),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (result) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ result })),
    ),
  )();
});

export const getTeamBPS = (team: number) =>
  pipe(
    getBPSCollection(),
    flatMap((collection) =>
      tryCatch(
        async () => await collection.findOne({ team }),
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Unable To get BPSes ${error}`,
        }),
      ),
    ),
    filterOrElse(
      (item) => item !== null,
      () => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: "No BPS for this team",
      }),
    ),
    map((teamBPS) => teamBPS.bpses),
  );

export const getAllBPSes = (forms: ScoutingForm[]) =>
  pipe(
    forms,
    groupBy((form) => form.teamNumber.toString()),
    mapWithIndex((teamStringedNumber, forms) =>
      sequenceS(ApplyPar)({
        forms: right(forms),
        bpses: pipe(
          getTeamBPS(parseInt(teamStringedNumber)),
          orElse<EndpointError, BPS[], EndpointError>(() => right([])),
        ),
      }),
    ),
    sequence(ApplicativePar),
    map((teams) => mapObject(teams, (team) => team.bpses)),
  );

export const getTeamBPSes = (teams: Record<string, ScoutingForm[]>) =>
  pipe(
    teams,
    mapWithIndex((teamStringedNumber, forms) =>
      sequenceS(ApplyPar)({
        forms: right(forms),
        bpses: getTeamBPS(parseInt(teamStringedNumber)),
      }),
    ),
    sequence(ApplicativePar),
  );
