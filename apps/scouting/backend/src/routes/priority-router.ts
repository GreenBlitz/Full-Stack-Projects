import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { flow, pipe } from "fp-ts/lib/function";
import { flatMap, fold, map, tryCatch, fromEither } from "fp-ts/lib/TaskEither";
import { right as rightEither } from "fp-ts/lib/Either";
import { map as mapTask } from "fp-ts/lib/Task";
import * as t from "io-ts";

import {
  createBodyVerificationPipe,
  createTypeCheckingEndpointFlow,
} from "../middleware/verification";
import type { EndpointError } from "../middleware/verification";
import type { TaskEither } from "fp-ts/lib/TaskEither";
import { getDb } from "../middleware/db";
import { left } from "fp-ts/lib/TaskEither";
import { flatTryCatch } from "../../../../../packages/flow-utils";

export const teamPriorityCodec = t.type({
  teamNumber: t.number,
  priority: t.number,
});

export const teamPriorityArrayCodec = t.array(teamPriorityCodec);

export type TeamPriority = t.TypeOf<typeof teamPriorityCodec>;

export const priorityRouter = Router();

const getPriorityCollection = flow(
  getDb,
  map((db) => db.collection<TeamPriority>("teamPriorities")),
);

export const readAllPriorities = (): TaskEither<
  EndpointError,
  TeamPriority[]
> =>
  pipe(
    getPriorityCollection(),
    flatTryCatch(
      (collection) => collection.find({}).toArray(),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Error reading priorities: ${error}`,
      }),
    ),
    mapTask(
      createTypeCheckingEndpointFlow(teamPriorityArrayCodec, (errors) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Invalid priorities data format. error: ${errors}`,
      })),
    ),
  );

export const readPriorityByTeamNumber = (
  teamNumber: number,
): TaskEither<EndpointError, TeamPriority> =>
  pipe(
    getPriorityCollection(),
    flatMap((collection) =>
      tryCatch(
        () => collection.findOne({ teamNumber }),
        (error): EndpointError => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Error reading priority for team ${teamNumber}: ${String(error)}`,
        }),
      ),
    ),
    flatMap((result) =>
      result
        ? pipe(
            rightEither(result),
            createTypeCheckingEndpointFlow(teamPriorityCodec, (errors) => ({
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              reason: `Invalid team priority format. error: ${errors}`,
            })),
            fromEither,
          )
        : left({
            status: StatusCodes.NOT_FOUND,
            reason: `Priority for team ${teamNumber} not found`,
          }),
    ),
  );

export const upsertPriority = (
  teamPriority: TeamPriority,
): TaskEither<EndpointError, void> =>
  pipe(
    getPriorityCollection(),
    flatMap((collection) =>
      tryCatch(
        () =>
          collection.updateOne(
            { teamNumber: teamPriority.teamNumber },
            { $set: { priority: teamPriority.priority } },
            { upsert: true },
          ),
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Error writing priority: ${error}`,
        }),
      ),
    ),
    map(() => undefined),
  );

priorityRouter.get("/", async (_req, res) => {
  await pipe(
    readAllPriorities(),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (priorities) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ priorities })),
    ),
  )();
});

priorityRouter.get("/:teamNumber", async (req, res) => {
  const teamNumber = Number(req.params.teamNumber);

  if (Number.isNaN(teamNumber)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("teamNumber must be a valid number");
    return;
  }

  await pipe(
    readPriorityByTeamNumber(teamNumber),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (teamPriority) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ teamPriority })),
    ),
  )();
});

priorityRouter.post("/", async (req, res) => {
  await pipe(
    rightEither(req),
    createBodyVerificationPipe(teamPriorityCodec),
    fromEither,
    flatMap((teamPriority) => upsertPriority(teamPriority)),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      () => () =>
        Promise.resolve(
          res
            .status(StatusCodes.OK)
            .json({ message: "Priority written successfully" }),
        ),
    ),
  )();
});
