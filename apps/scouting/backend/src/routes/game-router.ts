// בס"ד
import { Router } from "express";
import { join } from "path";
import { fold, fromEither, map, tryCatch } from "fp-ts/lib/TaskEither";
import { promises as fs } from "fs";
import { StatusCodes } from "http-status-codes";
import { flow, pipe } from "fp-ts/lib/function";
import { flatMap, orElse, right, left } from "fp-ts/lib/TaskEither";
import {
  createBodyVerificationPipe,
  createTypeCheckingEndpointFlow,
} from "../middleware/verification";
import type { EndpointError } from "../middleware/verification";
import type { TaskEither } from "fp-ts/lib/TaskEither";
import { right as rightEither } from "fp-ts/lib/Either";
import { map as mapTask } from "fp-ts/lib/Task";
import {
  gameDataCodec,
  gamesArrayCodec,
  type GameData,
} from "@repo/scouting_types";
import { getDb } from "../middleware/db";

export const gameRouter = Router();

const getGamesCollection = flow(
  getDb,
  map((db) => db.collection<GameData>("forms")),
);

export const readGames = (): TaskEither<EndpointError, GameData[]> =>
  pipe(
    getGamesCollection(),
    flatMap((collection) =>
      tryCatch(
        async () => await collection.find({}).toArray(),
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Error reading games file: ${error}`,
        }),
      ),
    ),
    mapTask(
      createTypeCheckingEndpointFlow(gamesArrayCodec, (errors) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Invalid games data format. error: ${errors}`,
      })),
    ),
  );

export const writeGames = (games: GameData[]) =>
  pipe(
    getGamesCollection(),
    flatMap((collection) =>
      tryCatch(
        async () => await collection.insertMany(games),
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Error writing games file: ${error}`,
        }),
      ),
    ),
  );

gameRouter.get("/", async (req, res) => {
  await pipe(
    readGames(),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (games) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ games })),
    ),
  )();
});

gameRouter.post("/", async (req, res) => {
  await pipe(
    rightEither(req),
    createBodyVerificationPipe(gameDataCodec),
    fromEither,
    flatMap((game) => writeGames([game])),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      () => () =>
        Promise.resolve(
          res.status(StatusCodes.OK).json({ message: "Wrote Succefully" }),
        ),
    ),
  )();
});
