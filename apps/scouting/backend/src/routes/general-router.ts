//בס"ד

import { Router } from "express";
import { getFormsCollection } from "./forms-router";
import { pipe } from "fp-ts/lib/function";
import { flatMap, fold, map, tryCatch } from "fp-ts/lib/TaskEither";
import { mongofyQuery } from "../middleware/query";
import { generalCalculateFuel } from "../fuel/fuel-general";
import { StatusCodes } from "http-status-codes";
import { flow } from "fp-ts/lib/function";
import * as Array from "fp-ts/lib/Array";
import * as NonEmptyArray from "fp-ts/lib/NonEmptyArray";
import * as Record from "fp-ts/lib/Record";

import type {
  FuelObject,
  GeneralData,
  GeneralFuelData,
  ScoutingForm,
  TeamNumberAndFuelData,
} from "@repo/scouting_types";
import { averageFuel } from "../fuel/distance-split";
import { firstElement, isEmpty } from "@repo/array-functions";
import { getAllBPS } from "./teams-router";
import { findMaxClimbLevel } from "./compare-router";
import { calculateAverageClimbsScore } from "./forecast-router";
import { nonEmptyArray } from "fp-ts";

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

export const formsToFuelData = flow(
  Array.map((form: ScoutingForm) => ({
    teamNumber: form.teamNumber,
    generalFuelData: generalCalculateFuel(form, getAllBPS()),
  })),

  NonEmptyArray.groupBy((fuelData) => fuelData.teamNumber.toString()),

  Record.map(
    (
      fuelArray: NonEmptyArray.NonEmptyArray<{
        generalFuelData: GeneralFuelData;
      }>,
    ) =>
      calcAverageGeneralFuelData(
        pipe(
          fuelArray,
          NonEmptyArray.map((fuelData) => fuelData.generalFuelData),
        ),
      ),
  ),
);

const formsToGeneralData = (forms: ScoutingForm[]) => {
  const calculatedFuel: TeamNumberAndFuelData = formsToFuelData(forms);

  const allGeneralData: GeneralData[] = Object.entries(calculatedFuel).map(
    (teamNumberAndFuelData) => {
      const [teamNumber, fuelData] = teamNumberAndFuelData;
      const teamForms = forms.filter(
        (form) => form.teamNumber.toString() === teamNumber,
      );

      const generalData: GeneralData = {
        teamNumber: Number(teamNumber),
        fuelData: fuelData,
        highestClimbLevel: findMaxClimbLevel(teamForms),
        avarageClimbPoints: {
          fullGame:
            calculateAverageClimbsScore(teamForms).auto +
            calculateAverageClimbsScore(teamForms).tele,
          auto: calculateAverageClimbsScore(teamForms).auto,
          tele: calculateAverageClimbsScore(teamForms).tele,
        },
      };

      return generalData;
    },
  );

  return allGeneralData;
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

    map((forms) => formsToGeneralData(forms)),

    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (generalData) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ generalData })),
    ),
  )();
});
