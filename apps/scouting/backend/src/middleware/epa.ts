// בס"ד

import {
  bind,
  bindTo,
  fold,
  map,
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
import { EndpointError, flatTryCatch, foldResponse } from "@repo/flow-utils";

import * as t from "io-ts";

const epaCodec = t.type({
  total_points: t.type({
    mean: t.number,
    sd: t.number,
  }),
  unitless: t.number,
  norm: t.number,
  conf: t.tuple([t.number, t.number]),
  breakdown: t.type({
    total_points: t.number,
    auto_points: t.number,
    teleop_points: t.number,
    endgame_points: t.number,
    energized_rp: t.number,
    supercharged_rp: t.number,
    traversal_rp: t.number,
    tiebreaker_points: t.number,
    auto_fuel: t.number,
    auto_tower: t.number,
    transition_fuel: t.number,
    first_shift_fuel: t.number,
    second_shift_fuel: t.number,
    teleop_fuel: t.number,
    endgame_fuel: t.number,
    endgame_tower: t.number,
    total_fuel: t.number,
    total_tower: t.number,
    rp_1: t.number,
    rp_2: t.number,
    rp_3: t.number,
  }),
});

const teamsYear = t.array(t.type({ epa: epaCodec, team: t.number }));

type EPA = t.TypeOf<typeof epaCodec>;

const getEPACollection = flow(
  getDb,
  map((db) => db.collection<EPA>("epa")),
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
  map((teams) => teams.map(({ epa, team }) => ({ ...epa, team }))),
  bindTo("epas"),
  bind("collection", getEPACollection),
  flatTryCatch(
    async ({ epas, collection }) => {
      console.log("Updating EPAS...");
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
    () => () => Promise.resolve(console.log("Updated EPAS!")),
  ),
);
export const startUpdatingEPAS = async () => {
  await updateEPA();

  const intervalMilliSeconds = 5 * 60 * 1000;
  setInterval(updateEPA, intervalMilliSeconds);
};

export const getEPAs = flow(
  getEPACollection,
  flatTryCatch(
    (collection) => collection.find().toArray(),
    (error) => ({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      reason: `Error Finding EPAS: ${error}`,
    }),
  ),
);
