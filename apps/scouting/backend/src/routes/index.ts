// בס"ד
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { promises as fs } from "fs";
import { join } from "path";
import { tbaRouter } from "./tba";
import { gameRouter } from "./game-router";
import { tryCatch, type TaskEither } from "fp-ts/lib/TaskEither";
import { flatMap } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { map } from "fp-ts/lib/Task";
import type { EndpointError } from "../middleware/verification";
import { createTypeCheckingEndpointFlow } from "../middleware/verification";
import * as t from "io-ts";

export const apiRouter = Router();

const DATA_DIR = join(process.cwd(), "data");
const GAMES_FILE = join(DATA_DIR, "games.json");
const JSON_INDENTATION = 2;

export const gameDataCodec = t.type({
  qual: t.string,
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
        try {
          const data = await fs.readFile(GAMES_FILE, "utf-8");
          const parsed = JSON.parse(data) as unknown;
          return parsed;
        } catch (error) {
          const err = error as { code?: string };
          if (err.code === "ENOENT") {
            return [] as unknown;
          }
          throw error;
        }
      },
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Error reading games file: ${error}`,
      })
    ),
    map(
      createTypeCheckingEndpointFlow(gamesArrayCodec, (errors) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Invalid games data format. error: ${errors}`,
      }))
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

apiRouter.use("/tba", tbaRouter);
apiRouter.use("/game", gameRouter);
apiRouter.get("/health", (req, res) => {
  res.status(StatusCodes.OK).send({ message: "Healthy!" });
});

