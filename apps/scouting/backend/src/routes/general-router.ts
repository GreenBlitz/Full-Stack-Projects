//בס"ד
/* eslint-disable @typescript-eslint/no-magic-numbers */ //for the example bps

import { Router } from "express";
import { getFormsCollection } from "./forms-router";
import { pipe } from "fp-ts/lib/function";
import { flatMap, fold, map, tryCatch } from "fp-ts/lib/TaskEither";
import { mongofyQuery } from "../middleware/query";
import { generalCalculateFuel } from "../fuel/fuel-general";
import { StatusCodes } from "http-status-codes";

import type { BPS, FuelObject, GeneralFuelData } from "@repo/scouting_types";
import { averageFuel } from "../fuel/distance-split";

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
const EMPTY_ARRAY = 0;
const FIRST_ARRAY_ITEM = 0;

const calcAverageGeneralFuelData = (fuelData: GeneralFuelData[]) => {
  if (fuelData.length === ONE_ITEM_ARRAY || fuelData.length === EMPTY_ARRAY) {
    return fuelData[FIRST_ARRAY_ITEM];
  }

  const accumulatedFuelData: AccumulatedFuelData =
    fuelData.reduce<AccumulatedFuelData>(
      (accumulated, currentFuelData) => {
        return {
          fullGame: [...accumulated.fullGame, currentFuelData.fullGame],
          auto: [...accumulated.auto, currentFuelData.auto],
          tele: [...accumulated.tele, currentFuelData.tele],
        };
      },
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
        (error) => ({ status: 500, reason: `DB Error: ${error}` }),
      ),
    ),
    map((forms) =>
      forms.map((form) => ({
        teamNumber: form.teamNumber,
        generalFuelData: generalCalculateFuel(form, EXAMPLE_BPS),
      })),
    ),

    map((generalFuelsData) => {
      const teamAndAllFuelData: Record<number, GeneralFuelData[]> =
        generalFuelsData.reduce((finalRecord, fuelData) => {
          finalRecord[fuelData.teamNumber]
            ? finalRecord[fuelData.teamNumber].push(fuelData.generalFuelData)
            : (finalRecord[fuelData.teamNumber] = [fuelData.generalFuelData]);

          return finalRecord;
        }, {});

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
