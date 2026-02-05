// בס"ד

import { Router } from "express";
import { right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { createTypeCheckingEndpointFlow } from "../middleware/verification";
import { flatMap, fold, fromEither, map, tryCatch } from "fp-ts/lib/TaskEither";
import { getFormsCollection } from "./forms-router";
import { StatusCodes } from "http-status-codes";
import { castItem } from "@repo/type-utils";
import {
  type ScoutingForm,
  type SectionTeamData,
  type TeamData,
  teamsProps,
} from "@repo/scouting_types";
import { groupBy } from "fp-ts/lib/NonEmptyArray";
import { calculateSum, mapObject } from "@repo/array-functions";
import type { BPS } from "../fuel/fuel-object";
import { splitByDistances } from "../fuel/distance-split";
import { calculateFuelStatisticsOfShift } from "../fuel/fuel-general";

export const teamsRouter = Router();

const processTeam = (bpses: BPS[], forms: ScoutingForm[]): TeamData => {
  const tele: SectionTeamData = {
    movement: {
      bumpStuck: calculateSum(forms, (form) =>
        Number(form.tele.movement.bumpStuck),
      ),
    },
    climbs: forms.map((form) => ({ match: form.match, ...form.tele.climb })),
    fuel: forms.map((form) => ({
      match: form.match,
      ...calculateFuelStatisticsOfShift(form.match, bpses, [
        form.tele.endgameShift,
        form.tele.transitionShift,
        ...form.tele.shifts,
      ]),
    })),
    accuracy: null,
    copr: 0,
    cdpr: 0,
  };
  return { tele } as TeamData;
};

const getBPSes = (): BPS[] => [];

teamsRouter.get("/", async (req, res) => {
  await pipe(
    getFormsCollection(),
    flatMap((collection) =>
      pipe(
        req.query,
        castItem,
        right,
        createTypeCheckingEndpointFlow(teamsProps, (error) => ({
          status: StatusCodes.BAD_REQUEST,
          reason: `Incorrect Query Parameters: ${error}`,
        })),
        fromEither,
        map(({ teams }) => ({ collection, teams })),
      ),
    ),
    flatMap(({ collection, teams }) =>
      tryCatch(
        () => collection.find({ teamNumber: { $in: teams } }).toArray(),
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Error Getting Teams From DB: ${error}`,
        }),
      ),
    ),
    map(groupBy((form) => form.teamNumber.toString())),
    map((teams) => ({ teams, bpses: getBPSes() })),
    map(({ teams, bpses }) => mapObject(teams, processTeam.bind(null, bpses))),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (teams) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ teams })),
    ),
  )();
});
