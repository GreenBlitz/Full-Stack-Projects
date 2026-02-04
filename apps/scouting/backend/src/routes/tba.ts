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
  type ScoreBreakdown2026,
  scoreBreakdown2026,
  tbaMatch,
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
} from "fp-ts/lib/TaskEither";
import { flow, pipe } from "fp-ts/lib/function";
import { map as taskMap } from "fp-ts/lib/Task";
import * as t from "io-ts";
import type { Type } from "io-ts";
import { getDb } from "../middleware/db";
import { getMax } from "@repo/array-functions";
import { fold as booleanFold } from "fp-ts/boolean";

export const tbaRouter = Router();

const TBA_KEY = process.env.TBA_API_KEY ?? "yourtbakey";
const TBA_URL = "https://www.thebluealliance.com/api/v3";

const tbaMatches = t.array(tbaMatch(scoreBreakdown2026, t.type({})));
type TBAMatches = t.TypeOf<typeof tbaMatches>;

const getCollection = flow(
  getDb,
  map((db) => db.collection<TBAMatches[number]>("tba")),
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
        reason: `Error Fetching From TBA: error ${error}`,
      }),
    ),
    taskMap(
      createTypeCheckingEndpointFlow(typeToCheck, (errors) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Recieved incorrect response from the TBA. error: ${errors}`,
      })),
    ),
  ) satisfies TaskEither<EndpointError, U>;

const insertMatches = (matches: TBAMatches) =>
  pipe(
    getCollection(),
    map((collection) => collection.insertMany(matches)),
  );
const getCurrentMatches = flow(
  getCollection,
  flatMap((collection) =>
    tryCatch(collection.find().toArray, (error) => ({
      reason: `Error getting from collection ${String(error)}`,
      status: StatusCodes.BAD_REQUEST,
    })),
  ),
);
tbaRouter.post("/matches", async (req, res) => {
  await pipe(
    right(req),
    createBodyVerificationPipe(matchesProps),
    fromEither,
    flatMap((body) =>
      pipe(
        getCurrentMatches(),
        map((currentMatches) => ({ currentMatches, body })),
      ),
    ),
    flatMap(({ currentMatches, body }) =>
      pipe(
        getMax(currentMatches, (match) => match.match_number).match_number <
          body.maxMatch,
        booleanFold(
          () =>
            pipe(
              fetchTba(`/event/${body.event}/matches`, tbaMatches),
              map((fetchedMatches) => {
                insertMatches(fetchedMatches);
                return fetchedMatches;
              }),
            ),
          () => fromEither(right(currentMatches)),
        ),
      ),
    ),
    fold(
      (error) => () =>
        new Promise((resolve) => {
          resolve(res.status(error.status).send(error.reason));
        }),
      (matches) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ matches })),
    ),
  )();
});
