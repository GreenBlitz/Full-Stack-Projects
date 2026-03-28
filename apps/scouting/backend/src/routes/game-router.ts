// בס"ד
import { Router } from "express";
import { bindTo, fold, fromEither, map, tryCatch } from "fp-ts/lib/TaskEither";
import { StatusCodes } from "http-status-codes";
import { flow, pipe } from "fp-ts/lib/function";
import { flatMap } from "fp-ts/lib/TaskEither";
import { createTypeCheckingEndpointFlow } from "@repo/type-utils";
import {
  createBodyVerificationPipe,
  type EndpointError,
  foldResponse,
  flatTryCatch,
} from "@repo/flow-utils";
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
  map((db) => db.collection<GameData>("games")),
);

export const readGames = (): TaskEither<EndpointError, GameData[]> =>
  pipe(
    getGamesCollection(),
    flatTryCatch(
      (collection) => collection.find({}).toArray(),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Error reading games file: ${error}`,
      }),
    ),
    map((item) => {
      console.log(item);
      return item;
    }),
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
    flatTryCatch(
      (collection) => collection.insertMany(games),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Error writing games file: ${error}`,
      }),
    ),
  );

gameRouter.get("/", async (req, res) => {
  await pipe(readGames(), bindTo("games"), foldResponse(res))();
});

gameRouter.post("/", async (req, res) => {
  await pipe(
    rightEither(req),
    createBodyVerificationPipe(gameDataCodec),
    fromEither,
    flatMap((game) => writeGames([game])),
    map(() => ({ message: "Wrote Succefully" })),
    foldResponse(res),
  )();
});
