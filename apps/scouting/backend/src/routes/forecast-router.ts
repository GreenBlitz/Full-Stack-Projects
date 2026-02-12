// בס"ד

import { Router } from "express";
import { pipe } from "fp-ts/lib/function";
import { createTypeCheckingEndpointFlow } from "../middleware/verification";
import {
  type Climb,
  forecastProps,
  type ScoutingForm,
} from "@repo/scouting_types";
import { right } from "fp-ts/lib/Either";
import { getFormsCollection } from "./forms-router";
import { flatMap, fold, fromEither, map, tryCatch } from "fp-ts/lib/TaskEither";
import { StatusCodes } from "http-status-codes";
import { groupBy } from "fp-ts/lib/NonEmptyArray";
import { calculateSum, mapObject } from "@repo/array-functions";
import { generalCalculateFuel } from "../fuel/fuel-general";
import { getAllBPS } from "./teams-router";
import { calcAverageGeneralFuelData } from "./general-router";
import { castItem } from "@repo/type-utils";

export const forecastRouter = Router();

const CLIMB_SCORE_VALUES = { L0: 0, L1: 10, L2: 20, L3: 30 };

const TELE_CLIMB_MULTIPLIER = 1;
const AUTO_CLIMB_MULTIPLIER = 1.5;

const calculateAverageClimbScore = (
  climbs: Climb["level"][],
  isAuto: boolean,
) =>
  calculateSum(
    climbs,
    (climb) =>
      CLIMB_SCORE_VALUES[climb] *
      (isAuto ? AUTO_CLIMB_MULTIPLIER : TELE_CLIMB_MULTIPLIER),
  );

const calculateAverageClimbsScore = (forms: ScoutingForm[]) => ({
  auto: calculateAverageClimbScore(
    forms.map((form) => form.auto.climb.level),
    true,
  ),
  tele: calculateAverageClimbScore(
    forms.map((form) => form.tele.climb.level),
    false,
  ),
});

const PASS_POINT_VALUE = 0.6;

forecastRouter.get("/", async (req, res) => {
  await pipe(
    req.query,
    castItem,
    right,
    createTypeCheckingEndpointFlow(forecastProps, (error) => ({
      status: StatusCodes.BAD_REQUEST,
      reason: `Query Does Not match Specified Type: ${error}`,
    })),
    fromEither,
    flatMap((query) =>
      pipe(
        getFormsCollection(),
        map((collection) => ({ collection, query })),
      ),
    ),
    flatMap(({ collection, query }) =>
      tryCatch(
        async () => ({
          redAlliance: await collection
            .find({
              teamNumber: { $in: query.redAlliance },
            })
            .toArray(),
          blueAlliance: await collection
            .find({
              teamNumber: { $in: query.blueAlliance },
            })
            .toArray(),
        }),
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Error getting teams from DB: ${error}`,
        }),
      ),
    ),
    map((alliancesForms) =>
      mapObject(
        alliancesForms,
        groupBy((form: ScoutingForm) => form.teamNumber.toString()),
      ),
    ),
    map((alliancesForms) =>
      mapObject(alliancesForms, Object.values<ScoutingForm[]>),
    ),
    map((alliancesTeamedForms) => ({
      alliancesTeamedForms,
      bps: getAllBPS(),
    })),
    map(({ alliancesTeamedForms, bps }) =>
      mapObject(alliancesTeamedForms, (allianceTeamedForms) =>
        allianceTeamedForms.map((teamForms) => ({
          climb: calculateAverageClimbsScore(teamForms),
          fuel: calcAverageGeneralFuelData(
            teamForms.map((form) => generalCalculateFuel(form, bps)),
          ),
        })),
      ),
    ),
    map((alliancesTeamedData) =>
      mapObject(alliancesTeamedData, (allianceTeamedData) =>
        allianceTeamedData.reduce(
          (acc, curr) => ({
            climb: {
              auto: acc.climb.auto + curr.climb.auto,
              tele: acc.climb.tele + curr.climb.tele,
            },
            fuel: {
              auto:
                acc.fuel.auto +
                curr.fuel.auto.scored +
                PASS_POINT_VALUE * curr.fuel.auto.passed,
              tele:
                acc.fuel.tele +
                curr.fuel.tele.scored +
                PASS_POINT_VALUE * curr.fuel.tele.passed,
              fullGame:
                acc.fuel.fullGame +
                curr.fuel.fullGame.scored +
                PASS_POINT_VALUE * curr.fuel.fullGame.passed,
            },
          }),
          {
            climb: { auto: 0, tele: 0 },
            fuel: { auto: 0, tele: 0, fullGame: 0 },
          },
        ),
      ),
    ),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (allianceData) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ allianceData })),
    ),
  )();
});
