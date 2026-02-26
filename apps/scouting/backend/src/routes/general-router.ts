//בס"ד

import { Router } from "express";
import { getFormsCollection } from "./forms-router";
import { pipe } from "fp-ts/lib/function";
import { flatMap, fold, map, tryCatch } from "fp-ts/lib/TaskEither";
import { mongofyQuery } from "../middleware/query";
import { calcAverageGeneralFuelData, generalCalculateFuel } from "../fuel/fuel-general";
import { StatusCodes } from "http-status-codes";
import { flow } from "fp-ts/lib/function";
import * as Array from "fp-ts/lib/Array";
import * as NonEmptyArray from "fp-ts/lib/NonEmptyArray";
import * as Record from "fp-ts/lib/Record";

import type {
  GeneralData,
  GeneralFuelData,
  ScoutingForm,
  TeamNumberAndFuelData,
} from "@repo/scouting_types";
import { getAllBPS } from "./teams-router";
import { findMaxClimbLevel } from "../climb/calculations";
import { calculateAverageClimbsScore } from "../climb/score";

export const generalRouter = Router();




const formsToFuelData = flow(
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
