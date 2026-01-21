// בס"ד
import { Router } from "express";
import { join } from "path";
import * as t from "io-ts";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { promises as fs } from "fs";
import { StatusCodes } from "http-status-codes";
import { pipe } from "fp-ts/lib/function";
import { flatMap, orElse, right, fromEither } from "fp-ts/lib/TaskEither";
import { createTypeCheckingEndpointFlow } from "../middleware/verification";
import type { EndpointError } from "../middleware/verification";
import type { TaskEither } from "fp-ts/lib/TaskEither";
import { right as rightEither } from "fp-ts/lib/Either";
export const gameRouter = Router();



const DATA_DIR = join(process.cwd(), "data");
const GAMES_FILE = join(DATA_DIR, "games.json");
const JSON_INDENTATION = 2;

export const gameDataCodec = t.type({
  matchNumber: t.number,
  matchType: t.keyof({
    practice: null,
    qualification: null,
    playoff: null,
  }),
  startTime: t.string,
});

export const gamesArrayCodec = t.array(gameDataCodec);

export type GameData = t.TypeOf<typeof gameDataCodec>;

const ensureDataDir = (): TaskEither<EndpointError, void> =>
  tryCatch(
    () => fs.mkdir(DATA_DIR, { recursive: true }).then(() => undefined),
    (error) => ({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      reason: `Error creating data directory: ${error}`,
    })
  );

export const readGames = (): TaskEither<EndpointError, GameData[]> =>
  pipe(
    tryCatch(
      async () => {
        const data = await fs.readFile(GAMES_FILE, "utf-8");
        return JSON.parse(data) as unknown;
      },
      (error) => {
        const err = error as { code?: string };
        if (err.code === "ENOENT") {
          return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            reason: "ENOENT",
          };
        }
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Error reading games file: ${error}`,
        };
      }
    ),
    orElse((error) => {
      if (error.reason === "ENOENT") {
        return right([] as unknown);
      }
      return tryCatch(
        () => Promise.reject(new Error(typeof error === "string" ? error : JSON.stringify(error))),
        () => error
      );
    }),
    flatMap((data) =>
      fromEither(
        createTypeCheckingEndpointFlow(gamesArrayCodec, (errors) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Invalid games data format. error: ${errors}`,
        }))(rightEither(data))
      )
    )
  );

export const writeGames = (games: GameData[]): TaskEither<EndpointError, void> =>
  pipe(
    ensureDataDir(),
    flatMap(() =>
      tryCatch(
        () =>
          fs.writeFile(
            GAMES_FILE,
            JSON.stringify(games, null, JSON_INDENTATION),
            "utf-8"
          ),
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Error writing games file: ${error}`,
        })
      )
    )
  );