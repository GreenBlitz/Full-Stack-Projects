//בס"ד
/* eslint-disable @typescript-eslint/no-magic-numbers */ //for the example bps

import { Router } from "express";
import { getFormsCollection } from "./forms-router";
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
import { averageFuel } from "../fuel/distance-split";
import { firstElement, isEmpty } from "@repo/array-functions";

export const generalRouter = Router();

interface AccumulatedFuelData {
  fullGame: FuelObject[];
  auto: FuelObject[];
  tele: FuelObject[];
}

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

const ONE_ITEM_ARRAY = 1;

const calcAverageGeneralFuelData = (fuelData: GeneralFuelData[]) => {
  if (fuelData.length === ONE_ITEM_ARRAY || isEmpty(fuelData)) {
    return firstElement(fuelData);
  }

  const accumulatedFuelData: AccumulatedFuelData =
    fuelData.reduce<AccumulatedFuelData>(
      (accumulated, currentFuelData) => ({
        fullGame: [...accumulated.fullGame, currentFuelData.fullGame],
        auto: [...accumulated.auto, currentFuelData.auto],
        tele: [...accumulated.tele, currentFuelData.tele],
      }),
      {
        fullGame: [],
        auto: [],
        tele: [],
      },
    );

  const averagedFuelData: GeneralFuelData = {
    fullGame: averageFuel(accumulatedFuelData.fullGame),
    auto: averageFuel(accumulatedFuelData.auto),
    tele: averageFuel(accumulatedFuelData.tele),
  };

  return averagedFuelData;
};

generalRouter.get("/", async (req, res) => {
  await pipe(
    getFormsCollection(),
    flatMap((collection) =>
      tryCatch(
        () => collection.find(mongofyQuery(req.query)).toArray(),
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `DB Error: ${error}`,
        }),
      ),
    ),
    map((forms) =>
      forms.map((form) => ({
        teamNumber: form.teamNumber,
        generalFuelData: generalCalculateFuel(form, EXAMPLE_BPS),
      })),
    ),

    map((generalFuelsData) => {
      return generalFuelsData.reduce<Record<number, GeneralFuelData[]>>(
        (accumulatorRecord, fuelData) => {
          return {
            ...accumulatorRecord,
            [fuelData.teamNumber]: [
              ...accumulatorRecord[fuelData.teamNumber],
              fuelData.generalFuelData,
            ],
          };
        },
        {},
      );
    }),

    map((teamAndAllFuelData) => {
      const teamAndAvaragedFuelData: Record<number, GeneralFuelData> = {};
      Object.entries(teamAndAllFuelData).forEach(([teamNumber, fuelArray]) => {
        teamAndAvaragedFuelData[teamNumber] =
          calcAverageGeneralFuelData(fuelArray);
      });

      return teamAndAvaragedFuelData;
    }),

    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (calculatedFuel) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ calculatedFuel })),
    ),
  )();
});
