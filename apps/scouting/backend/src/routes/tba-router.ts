// בס"ד
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { Router } from "express";
import {
  createBodyVerificationPipe,
  flatTryCatch,
  createLog,
  tap,
  toUnion,
  type EndpointError,
} from "@repo/flow-utils";
import { castItem, createTypeCheckingEndpointFlow } from "@repo/type-utils";
import {
  COPR_TO_TBA_COPR,
  eventOPRCodec,
  Match,
  matchesProps,
  oprPropsCodec,
  tbaMatches2026,
  TBAMatches2026,
  type TBAMatchesProps,
} from "@repo/scouting_types";
import { right as rightEither } from "fp-ts/lib/Either";
import { StatusCodes } from "http-status-codes";
import {
  flatMap,
  type TaskEither,
  fromEither,
  tryCatch,
  map,
  chainFirstW,
  bindTo,
  right,
} from "fp-ts/lib/TaskEither";
import { flow, identity, pipe } from "fp-ts/lib/function";
import { map as taskMap } from "fp-ts/lib/Task";
import type { Type } from "io-ts";
import { getDb } from "../middleware/db";
import {
  firstElement,
  getMax,
  isEmpty,
  mapKeys,
  mapObject,
} from "@repo/array-functions";
import { fold as booleanFold } from "fp-ts/boolean";
import { foldResponse } from "@repo/flow-utils";
import { compareMatches, tbaMatchToRegularMatch } from "@repo/scouting_types";
import { TeamOPR } from "@repo/scouting_types";
import { teamStringToTeamNumber } from "@repo/frc";

export const tbaRouter = Router();

const TBA_KEY = process.env.TBA_API_KEY;
const TBA_URL = "https://www.thebluealliance.com/api/v3";

const currentEvent = "2026cahal";

const getMatchesCollection = flow(
  getDb,
  map((db) => db.collection<TBAMatches2026[number]>("tba/matches")),
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
    createLog(
      () => route,
      () => route,
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
        () => fromEither(rightEither(currentMatches)),

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

export const fetchCOPRS = (event: string) =>
  pipe(
    fetchTba(`/event/${event}/coprs`, eventOPRCodec),
    map((coprs) =>
      Object.keys(firstElement(Object.values(coprs)) ?? {}) // gets all of the team strings (frc4590, frc1690)
        .map((teamString) => ({
          ...mapObject(coprs, (coprTeams) => coprTeams?.[teamString]),
          teamNumber: teamStringToTeamNumber(teamString),
        })),
    ),
    map((teams) =>
      teams.map((team) =>
        mapKeys(team, (key) =>
          key === "teamNumber" ? "teamNumber" : COPR_TO_TBA_COPR[key],
        ),
      ),
    ),
    map((item) => item as TeamOPR[]),
  );

export const fetchTeamsCOPRs = <A extends object>(
  teams: Record<string, A>,
  event: string = currentEvent,
): TaskEither<never, Record<string, A & { coprs?: TeamOPR }>> =>
  pipe(
    fetchCOPRS(event),
    map((coprs) =>
      mapObject(teams, (team, teamNumber) => ({
        ...team,
        coprs: coprs.find((copr) => copr.teamNumber === parseInt(teamNumber)),
      })),
    ),

    toUnion(teams),
  );

tbaRouter.post("/matches", async (req, res) => {
  await pipe(
    rightEither(req),
    createBodyVerificationPipe(matchesProps),
    fromEither,
    getMatches,
    bindTo("matches"),
    foldResponse(res),
  )();
});

tbaRouter.get("/copr", async (req, res) => {
  await pipe(
    req.query,
    castItem,
    rightEither,
    createTypeCheckingEndpointFlow(oprPropsCodec, () => ({
      status: StatusCodes.BAD_REQUEST,
      reason: "Did not pass in event",
    })),
    fromEither,
    flatMap(({ event }) => fetchCOPRS(event)),
    bindTo("teams"),
    foldResponse(res),
  )();
});
