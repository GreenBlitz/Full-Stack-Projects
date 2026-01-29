// בס"ד
import { MongoClient, type Db } from "mongodb";
import { map, right, type TaskEither, tryCatch } from "fp-ts/TaskEither";
import type { EndpointError } from "./verification";
import { StatusCodes } from "http-status-codes";
import { pipe } from "fp-ts/lib/function";

const url = process.env.MONGO_URI ?? "mongodb://localhost:27017";
const dbName = "scouting";

const client = new MongoClient(url);

let db: Db | undefined; // 😭 has to happen

export const getDb = (): TaskEither<EndpointError, Db> =>
  db
    ? right(db)
    : pipe(
        tryCatch(
          () => client.connect(),
          (error) => ({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            reason: `Database not connected: ${JSON.stringify(error)}`,
          }),
        ),
        map(() => client.db(dbName)),
      );
