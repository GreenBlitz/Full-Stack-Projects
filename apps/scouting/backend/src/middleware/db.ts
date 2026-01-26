// בס"ד
import { MongoClient, type Db } from "mongodb";
import { map, type TaskEither, tryCatch } from "fp-ts/TaskEither";
import type { EndpointError } from "./verification";
import { StatusCodes } from "http-status-codes";
import { pipe } from "fp-ts/lib/function";

const url = process.env.MONGO_URI ?? "mongodb://localhost:27017";
const dbName = "scouting_db";

const client = new MongoClient(url);

export const getDb = (): TaskEither<EndpointError, Db> =>
  pipe(
    tryCatch(client.connect, (error) => ({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      reason: `Databse not connected: ${error}`,
    })),
    map(() => client.db(dbName)),
  );
