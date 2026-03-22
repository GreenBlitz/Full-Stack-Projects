// בס"ד

import {
  bind,
  bindTo,
  fold,
  map,
  right,
  TaskEither,
  tryCatch,
} from "fp-ts/lib/TaskEither";
import { getDb } from "./db";
import { flow, pipe } from "fp-ts/lib/function";
import { Type } from "io-ts";
import axios, { AxiosRequestConfig } from "axios";
import { StatusCodes } from "http-status-codes";
import { map as taskMap } from "fp-ts/lib/Task";
import { createTypeCheckingEndpointFlow } from "@repo/type-utils";
import { EndpointError, flatTryCatch } from "@repo/flow-utils";
import { EPA, teamsYear } from "@repo/scouting_types/epa";
import { mapObject } from "@repo/array-functions";

interface SavedEPA {
  team: number;
  epa: EPA;
}
const getEPACollection = flow(
  getDb,
  map((db) => db.collection<SavedEPA>("epa")),
);

const STATBOTICS_URL = "https://api.statbotics.io/v3";
const LOCATION = "country=Israel";
const YEAR = 2026;

const fetchEPAs = (config?: AxiosRequestConfig) =>
  pipe(
    tryCatch(
      () =>
        axios
          .get(`${STATBOTICS_URL}/team_years?year=${YEAR}&${LOCATION}`, config)
          .then((response) => response.data as unknown),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Error Fetching From Statbotics: error ${String(error)}`,
      }),
    ),
    taskMap(
      createTypeCheckingEndpointFlow(teamsYear, (errors) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Recieved incorrect response from the Statbotics. error: ${errors}`,
      })),
    ),
  ) satisfies TaskEither<EndpointError, unknown>;

const updateEPA = pipe(
  fetchEPAs(),
  bindTo("epas"),
  bind("collection", getEPACollection),
  flatTryCatch(
    async ({ epas, collection }) => {
      console.log("Updating EPAs...");
      await collection.deleteMany();
      await collection.insertMany(epas);
    },
    (error) => ({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      reason: `Error Deleting and inserting epas: ${error}`,
    }),
  ),
  fold(
    (error) => () => Promise.resolve(console.log(error)),
    () => () => Promise.resolve(console.log("Updated EPAs!")),
  ),
);
export const startUpdatingEPAS = async () => {
  await updateEPA();

  const fiveMinutesInMilliseconds = 5 * 60 * 1000;
  setInterval(updateEPA, fiveMinutesInMilliseconds);
};

const getEPAs = flow(
  getEPACollection,
  flatTryCatch(
    (collection) => collection.find().toArray(),
    (error) => ({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      reason: `Error Finding EPAS: ${error}`,
    }),
  ),
);

export const getTeamsEPAs = <A extends object>(teams: Record<string, A>) =>
  pipe(
    getEPAs(),
    map((epaTeams) =>
      epaTeams.reduce<Record<string, EPA>>(
        (acc, { team, epa }) => ({ ...acc, [team.toString()]: epa }),
        {},
      ),
    ),
    map((epaTeams) =>
      mapObject(teams, (team, teamNumber) => ({
        ...team,
        epa: epaTeams[teamNumber],
      })),
    ),
  );
