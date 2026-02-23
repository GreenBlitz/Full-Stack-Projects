//בס"ד

import type {
  ScoutingForm,
  TeleClimbLevel,
  TimesClimedToLevels,
} from "@repo/scouting_types";
import { Router } from "express";
import { getFormsCollection } from "./forms-router";
import { pipe } from "fp-ts/lib/function";
import {
  flatMap,
  left,
  map,
  right,
  tryCatch,
  fold,
} from "fp-ts/lib/TaskEither";
import { mongofyQuery } from "../middleware/query";
import { StatusCodes } from "http-status-codes";
import { calculateSum, firstElement, isEmpty } from "@repo/array-functions";
import { calcAverageGeneralFuelData } from "./general-router";
import { generalCalculateFuel } from "../fuel/fuel-general";
import { getAllBPS } from "./teams-router";
import { findMaxClimbLevel } from "../climb/calculations";

export const compareRouter = Router();

type GamePeriod = "auto" | "fullGame" | "teleop";

const DIGITS_AFTER_DECIMAL_DOT = 2;


const calculateAverageScoredFuel = (
  forms: ScoutingForm[],
  gamePeriod: GamePeriod,
) => {
  const generalFuelData = forms.map((form) =>
    generalCalculateFuel(form, getAllBPS()),
  );
  const averagedFuelData = calcAverageGeneralFuelData(generalFuelData);
  console.log(
    `auto fuel: ${averagedFuelData.auto.scored.toFixed(DIGITS_AFTER_DECIMAL_DOT)}`,
  );
  console.log(
    `fullGame fuel: ${averagedFuelData.fullGame.scored.toFixed(DIGITS_AFTER_DECIMAL_DOT)}`,
  );

  return parseFloat(
    averagedFuelData[gamePeriod].scored.toFixed(DIGITS_AFTER_DECIMAL_DOT),
  );
};


compareRouter.get("/", async (req, res) => {
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
    flatMap((forms) => {
      if (isEmpty(forms)) return right(forms);

      const firstTeam = firstElement(forms).teamNumber;
      const isSameTeam = forms.every((f) => f.teamNumber === firstTeam);

      return isSameTeam
        ? right(forms)
        : left({
            status: StatusCodes.BAD_REQUEST,
            reason:
              "Compare Two Validation Error: Forms contain data from multiple different teams.",
          });
    }),
    map((teamForms) => ({
      teamNumber: firstElement(teamForms).teamNumber,
      averageFuel: {
        averageFuelInGame: calculateAverageScoredFuel(teamForms, "fullGame"),
        averageFuelInAuto: calculateAverageScoredFuel(teamForms, "auto"),
      },
      climb: {
        maxClimbLevel: findMaxClimbLevel(teamForms),
        timesClimbedToMax: findTimesClimbedToLevel(
          teamForms,
          findMaxClimbLevel(teamForms),
        ),
        timesClimbedInAuto: findTimesClimbedInAuto(teamForms),
        timesClimbedToLevels: findTimesClimbedToLevels(teamForms),
      },
    })),

    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (teamCompareData) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ teamCompareData })),
    ),
  )();
});
