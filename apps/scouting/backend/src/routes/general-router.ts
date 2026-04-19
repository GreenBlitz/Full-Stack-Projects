//בס"ד

import { Router } from "express";
import { getFormsCollection } from "./forms-router";
import { pipe } from "fp-ts/lib/function";
import { fold, map, bindTo, bind } from "fp-ts/lib/TaskEither";
import { mongofyQuery, flatTryCatch } from "@repo/flow-utils";
import { StatusCodes } from "http-status-codes";

import {
  excludeNoShowForms,
  type GeneralData,
  type ScoutingForm,
} from "@repo/scouting_types";
import { findMaxClimbLevel } from "../climb/calculations";
import { calculateAverageClimbsScore } from "../climb/score";
import { groupBy } from "fp-ts/lib/NonEmptyArray";

export const generalRouter = Router();

const formsToGeneralData = (forms: ScoutingForm[]) => {
  const groupedForms = groupBy((form: ScoutingForm) =>
    form.teamNumber.toString(),
  )(forms);

  const allGeneralData: GeneralData[] = Object.entries(groupedForms).map(
    ([teamNumber, teamForms]) => {
      const generalData: GeneralData = {
        teamNumber: Number(teamNumber),
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
    flatTryCatch(
      (collection) => collection.find(mongofyQuery(req.query)).toArray(),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `DB Error: ${error}`,
      }),
    ),

    bindTo("forms"),
    map(({ forms }) => ({ forms: excludeNoShowForms(forms) })),

    map(({ forms}) => formsToGeneralData(forms)),

    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (generalData) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ generalData })),
    ),
  )();
});
