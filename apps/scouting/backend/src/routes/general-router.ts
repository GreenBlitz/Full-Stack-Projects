//בס"ד
/* eslint-disable @typescript-eslint/no-magic-numbers */ //for the example bps

import { Router } from "express";
import { getCollection } from "./forms-router";
import { pipe } from "fp-ts/lib/function";
import { flatMap, fold, map, tryCatch } from "fp-ts/lib/TaskEither";
import { mongofyQuery } from "../middleware/query";
import { generalCalculateFuel } from "../fuel/fuel-general";
import { StatusCodes } from "http-status-codes";

import type {
  BPS,
  FuelObject,
  GeneralFuelData,
  TeamNumberAndFuelData,
} from "@repo/scouting_types";

export const generalRouter = Router();

const EXAMPLE_BPS: BPS[] = [
  {
    match: {
      number: 42,
      type: "qualification",
    },
    events: [
      {
        shoot: [12, 45, 88, 110],
        score: [12, 88],
      },
      {
        shoot: [135, 140],
        score: [135, 140],
      },
    ],
  },
];

const DIVIDE_BY_TO_GET_AVERAGE = 2;
const ONE_ITEM_ARRAY = 1;
const EMPTY_ARRAY = 0;
const FIRST_ARRAY_ITEM = 0;

const calcAverage = (num1: number, num2: number) => {
  return (num1 + num2) / DIVIDE_BY_TO_GET_AVERAGE;
};

const calcAverageFuelObject = (
  firstData: FuelObject,
  secondData: FuelObject,
) => {
  const newData: FuelObject = {
    scored: calcAverage(firstData.scored, secondData.scored),
    shot: calcAverage(firstData.shot, secondData.shot),
    missed: calcAverage(firstData.missed, secondData.missed),
    positions: [...firstData.positions, ...secondData.positions],
  };
  return newData;
};

const calcAverageGeneralFuelData = (fuelData: GeneralFuelData[]) => {
  if (fuelData.length === ONE_ITEM_ARRAY || fuelData.length === EMPTY_ARRAY) {
    return fuelData[FIRST_ARRAY_ITEM];
  }
  return fuelData.reduce((accumulatedFuelData, currentFuelData) => {
    const newFuelData: GeneralFuelData = {
      fullGame: calcAverageFuelObject(
        accumulatedFuelData.fullGame,
        currentFuelData.fullGame,
      ),
      auto: calcAverageFuelObject(
        accumulatedFuelData.auto,
        currentFuelData.auto,
      ),
      tele: calcAverageFuelObject(
        accumulatedFuelData.tele,
        currentFuelData.tele,
      ),
    };
    return newFuelData;
  }, fuelData[FIRST_ARRAY_ITEM]);
};

generalRouter.get("/", async (req, res) => {
  await pipe(
    getCollection(),
    flatMap((collection) =>
      tryCatch(
        () => collection.find(mongofyQuery(req.query)).toArray(),
        (error) => ({ status: 500, reason: `DB Error: ${error}` }),
      ),
    ),
    map((forms) =>
      forms.map((form) => {
        const newFuelData: TeamNumberAndFuelData = {
          teamNumber: form.teamNumber,
          generalFuelData: generalCalculateFuel(form, EXAMPLE_BPS),
        };
        return newFuelData;
      }),
    ),

    map((generalFuelsData) => {
      const teamMap: Map<number, TeamNumberAndFuelData> = new Map();
      generalFuelsData.forEach((current) => {
        if (teamMap.has(current.teamNumber)) return;

        const sameTeamFuelData = generalFuelsData.filter(
          (teamAndFuelData) =>
            teamAndFuelData.teamNumber === current.teamNumber,
        );
        const averagedFuelData: TeamNumberAndFuelData = {
          teamNumber: current.teamNumber,
          generalFuelData: calcAverageGeneralFuelData(
            sameTeamFuelData.map((fuelData) => fuelData.generalFuelData),
          ),
        };
        teamMap.set(current.teamNumber, averagedFuelData);
      });
      return Array.from(teamMap.values());
    }),

    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (calculatedFuel) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ calculatedFuel })),
    ),
  )();
});
