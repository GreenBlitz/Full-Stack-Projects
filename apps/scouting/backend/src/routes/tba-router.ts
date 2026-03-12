// בס"ד
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { Router } from "express";
import {
  createBodyVerificationPipe,
  flatTryCatch,
  type EndpointError,
} from "@repo/flow-utils";
import { createTypeCheckingEndpointFlow } from "@repo/type-utils";
import {
  Match,
  matchesProps,
  tbaMatches2026,
  TBAMatches2026,
  type TBAMatchesProps,
} from "@repo/scouting_types";
import { right } from "fp-ts/lib/Either";
import { StatusCodes } from "http-status-codes";
import {
  flatMap,
  type TaskEither,
  fromEither,
  tryCatch,
  map,
  chainFirstW,
  bindTo,
} from "fp-ts/lib/TaskEither";
import { flow, pipe } from "fp-ts/lib/function";
import { map as taskMap } from "fp-ts/lib/Task";
import type { Type } from "io-ts";
import { getDb } from "../middleware/db";
import { getMax, isEmpty } from "@repo/array-functions";
import { fold as booleanFold } from "fp-ts/boolean";
import { foldResponse } from "@repo/flow-utils";
import { compareMatches, tbaMatchToRegularMatch } from "@repo/scouting_types";
import { TeamOPR } from "@repo/scouting_types";

export const tbaRouter = Router();

const TBA_KEY = process.env.TBA_API_KEY;
const TBA_URL = "https://www.thebluealliance.com/api/v3";

const getMatchesCollection = flow(
  getDb,
  map((db) => db.collection<TBAMatches2026[number]>("tba/matches")),
);

const getOPRCollection = flow(
  getDb,
  map((db) => db.collection<TeamOPR>("tba/opr")),
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

const insertMatches = (matches: TBAMatches2026) =>
  pipe(
    getMatchesCollection(),
    flatTryCatch(
      (collection) => collection.insertMany(matches),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Error inserting matches: ${String(error)}`,
      }),
    ),
  );

const getStoredMatches = pipe(
  getMatchesCollection(),
  flatTryCatch(
    (collection) => collection.find().toArray(),
    (error) => ({
      reason: `Error getting from collection ${String(error)}`,
      status: StatusCodes.BAD_REQUEST,
    }),
  ),
  map((docs) => docs.map(({ _id, ...rest }) => rest) satisfies TBAMatches2026),
);

const getMaxMatch = (matches: TBAMatches2026): Match => {
  if (isEmpty(matches)) {
    return { type: "practice", number: 0 };
  }
  const lastMatch = getMax(matches, (match) => match.match_number);
  return tbaMatchToRegularMatch(lastMatch);
};

const DID_COMPARE_FAIL = 0;
const getMatches = flow(
  flatMap((body: TBAMatchesProps) =>
    pipe(
      getStoredMatches,
      map((currentMatches) => ({ currentMatches, body })),
    ),
  ),
  flatMap(({ currentMatches, body }) =>
    pipe(
      compareMatches(getMaxMatch(currentMatches), body.maxMatch) <
        DID_COMPARE_FAIL,
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
    bindTo("matches"),
    foldResponse(res),
  )();
});
