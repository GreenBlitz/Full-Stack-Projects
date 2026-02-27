//בס"ד

import { Router } from "express";
import { getFormsCollection } from "./forms-router";
import { pipe } from "fp-ts/lib/function";
import { flatMap, fold, map, tryCatch } from "fp-ts/lib/TaskEither";
import { mongofyQuery } from "../middleware/query";
import { StatusCodes } from "http-status-codes";

import type {
  GeneralData,
  ScoutingForm,
  TeamNumberAndFuelData,
} from "@repo/scouting_types";
import { findMaxClimbLevel } from "../climb/calculations";
import { calculateAverageClimbsScore } from "../climb/score";
import { formsToFuelData } from "../fuel/fuel-general";

export const generalRouter = Router();

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

