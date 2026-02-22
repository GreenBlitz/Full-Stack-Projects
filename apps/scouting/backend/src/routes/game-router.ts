// בס"ד
import { Router } from "express";
import { join } from "path";
import { fold, fromEither, tryCatch } from "fp-ts/lib/TaskEither";
import { promises as fs } from "fs";
import { StatusCodes } from "http-status-codes";
import { pipe } from "fp-ts/lib/function";
import { flatMap, orElse, right, left } from "fp-ts/lib/TaskEither";
import {
  createBodyVerificationPipe,
  createTypeCheckingEndpointFlow,
} from "../middleware/verification";
import type { EndpointError } from "../middleware/verification";
import type { TaskEither } from "fp-ts/lib/TaskEither";
import { right as rightEither } from "fp-ts/lib/Either";
import { map } from "fp-ts/lib/Task";
import {
  gameDataCodec,
  gamesArrayCodec,
  type GameData,
} from "@repo/scouting_types";

export const gameRouter = Router();

const DATA_DIR = join(process.cwd(), "data");
const GAMES_FILE = join(DATA_DIR, "games.json");
const JSON_INDENTATION = 2;

const ensureDataDir = (): TaskEither<EndpointError, void> =>
  tryCatch(
    () => fs.mkdir(DATA_DIR, { recursive: true }).then(() => undefined),
    (error) => ({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      reason: `Error creating data directory: ${error}`,
    }),
  );

export const readGames = (): TaskEither<EndpointError, GameData[]> =>
  pipe(
    tryCatch(
      async () => {
        const data = await fs.readFile(GAMES_FILE, "utf-8");
        return JSON.parse(data) as unknown;
      },
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason:
          error?.["code"] === "ENOENT"
            ? "ENOENT"
            : `Error reading games file: ${error}`,
      }),
    ),
    orElse((error) => (error.reason === "ENOENT" ? right([]) : left(error))),
    map(
      createTypeCheckingEndpointFlow(gamesArrayCodec, (errors) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Invalid games data format. error: ${errors}`,
      })),
    ),
  );

export const writeGames = (
  games: GameData[],
): TaskEither<EndpointError, void> =>
  pipe(
    ensureDataDir(),
    flatMap(() =>
      tryCatch(
        () =>
          fs.writeFile(
            GAMES_FILE,
            JSON.stringify(games, null, JSON_INDENTATION),
            "utf-8",
          ),
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
