//בס"ד

import { Router } from "express";
import { getFormsCollection } from "./forms-router";
import { pipe } from "fp-ts/lib/function";
import {
  bind,
  bindTo,
  flatMap,
  fold,
  map,
  right,
  tryCatch,
} from "fp-ts/lib/TaskEither";
import { mongofyQuery } from "../middleware/query";
import { generalCalculateFuel } from "../fuel/fuel-general";
import { StatusCodes } from "http-status-codes";

import type { BPS, FuelObject, GeneralFuelData } from "@repo/scouting_types";
import { averageFuel } from "../fuel/distance-split";
import { firstElement, isEmpty } from "@repo/array-functions";
import { getAllBpses } from "./bps-router";

export const generalRouter = Router();

interface AccumulatedFuelData {
  fullGame: FuelObject[];
  auto: FuelObject[];
  tele: FuelObject[];
}

const ONE_ITEM_ARRAY = 1;

export const calcAverageGeneralFuelData = (
  fuelData: GeneralFuelData[],
): GeneralFuelData => {
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
    bindTo("forms"),
    bind("teamBpses", ({ forms }) => getAllBpses(forms)),
    map(({ forms, teamBpses }) =>
      forms.map((form) => ({
        teamNumber: form.teamNumber,
        generalFuelData: generalCalculateFuel(form, teamBpses[form.teamNumber]),
      })),
    ),

    map((generalFuelsData) =>
      generalFuelsData.reduce<Record<number, GeneralFuelData[]>>(
        (accumulatorRecord, fuelData) => ({
          ...accumulatorRecord,
          [fuelData.teamNumber]: [
            ...(accumulatorRecord[fuelData.teamNumber] ?? []),
            fuelData.generalFuelData,
          ],
        }),
        {},
      ),
    ),

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
