// בס"ד
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { Router } from "express";
import {
  createBodyVerificationPipe,
  createTypeCheckingEndpointFlow,
  type EndpointError,
} from "../middleware/verification";
import {
  matchesProps,
  tbaMatches2026,
  TBAMatches2026,
  type TBAMatchesProps,
} from "@repo/scouting_types";
import { right } from "fp-ts/lib/Either";
import { StatusCodes } from "http-status-codes";
import {
  flatMap,
  fold,
  type TaskEither,
  fromEither,
  tryCatch,
  map,
  mapLeft,
  chainFirstW,
  bindTo,
} from "fp-ts/lib/TaskEither";
import { flow, pipe } from "fp-ts/lib/function";
import { map as taskMap } from "fp-ts/lib/Task";
import * as t from "io-ts";
import type { Type } from "io-ts";
import { getDb } from "../middleware/db";
import { getMax, isEmpty } from "@repo/array-functions";
import { fold as booleanFold } from "fp-ts/boolean";

export const tbaRouter = Router();

const TBA_KEY = process.env.TBA_API_KEY;
const TBA_URL = "https://www.thebluealliance.com/api/v3";



const getCollection = flow(
  getDb,
  map((db) => db.collection<TBAMatches2026[number]>("tba")),
);

const fetchTba = <U>(
  route: string,
  typeToCheck: Type<U, unknown>,
  config?: AxiosRequestConfig,
) =>
  pipe(
    tryCatch(
      () =>
        axios
          .get(TBA_URL + route, {
            headers: { "X-TBA-Auth-Key": TBA_KEY },
            ...config,
          })
          .then((response) => response.data as unknown),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Error Fetching From TBA: error ${String(error)}`,
      }),
    ),
    taskMap(
      createTypeCheckingEndpointFlow(typeToCheck, (errors) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Recieved incorrect response from the TBA. error: ${errors}`,
      })),
    ),
  ) satisfies TaskEither<EndpointError, U>;

/**
 * Insert fetched matches into Mongo.
 * We ignore the insert result for now; endpoint returns the matches array anyway.
 */
const insertMatches = (matches: TBAMatches2026) =>
  pipe(
    getCollection(),
    flatMap((collection) =>
      tryCatch(
        () => collection.insertMany(matches),
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Error inserting matches: ${String(error)}`,
        }),
      ),
    ),
  );

/**
 * IMPORTANT FIX:
 * Mongo returns WithId<T>[] from find().toArray(), but your fetched matches are T[].
 * So we strip _id here and return plain TBAMatches.
 */
const getStoredMatches = pipe(
  getCollection(),
  flatMap((collection) =>
    tryCatch(
      () => collection.find().toArray(),
      (error) => ({
        reason: `Error getting from collection ${String(error)}`,
        status: StatusCodes.BAD_REQUEST,
      }),
    ),
  ),
  map((docs) => docs.map(({ _id, ...rest }) => rest) satisfies TBAMatches2026),
);

const getMaxMatchNumber = (matches: TBAMatches2026) =>
  isEmpty(matches) ? 0 : getMax(matches, (m) => m.match_number).match_number;

/**
 * IMPORTANT FIXES:
 * 1) booleanFold order: fold(onFalse, onTrue)
 * 2) insert side-effect: use chainFirstW with TaskEither (NOT chainFirstTaskK)
 */
const getMatches = flow(
  flatMap((body: TBAMatchesProps) =>
    pipe(
      getStoredMatches,
      map((currentMatches) => ({ currentMatches, body })),
    ),
  ),
  flatMap(({ currentMatches, body }) =>
    pipe(
      getMaxMatchNumber(currentMatches) < body.maxMatch,
      booleanFold(
        // FALSE => already have enough stored
        () => fromEither(right(currentMatches)),

        // TRUE => fetch more, store them, return fetched
        () =>
          pipe(
            fetchTba(`/event/${body.event}/matches`, tbaMatches2026),
            chainFirstW((fetchedMatches) => insertMatches(fetchedMatches)),
          ),
      ),
    ),
  ),
);

tbaRouter.post("/matches", async (req, res) => {
  await pipe(
    right(req),
    createBodyVerificationPipe(matchesProps),
    fromEither,
    getMatches,
    fold(
      (error) => async () => {
        res.status(error.status).send(error.reason);
      },
      (matches) => async () => {
        res.status(StatusCodes.OK).json({ matches });
      },
    ),
  )();
});

/**
 * Optional: dev helper (don’t leave this in prod)
 */
