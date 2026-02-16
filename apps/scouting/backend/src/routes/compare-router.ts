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

export const compareRouter = Router();

type GamePeriod = "auto" | "fullGame" | "teleop";

const DIGITS_AFTER_DECIMAL_DOT = 2;
const INITIAL_COUNTER_VALUE = 0;
const INCREMENT = 1;

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

const findMaxClimbLevel = (forms: ScoutingForm[]) => {
  const fullGameClimbedLevels = [
    ...forms.map((form) => form.tele.climb.level),
    ...forms.map((form) => form.auto.climb.level),
  ];

  return fullGameClimbedLevels.includes("L3")
    ? "L3"
    : fullGameClimbedLevels.includes("L2")
      ? "L2"
      : fullGameClimbedLevels.includes("L1")
        ? "L1"
        : "L0";
};

const findTimesClimbedToMax = (
  forms: ScoutingForm[],
  maxLevel: TeleClimbLevel,
) => {
  return calculateSum(forms, (form) =>
    form.tele.climb.level === maxLevel ? INCREMENT : INITIAL_COUNTER_VALUE,
  );
};

const findTimesClimbedInAuto = (forms: ScoutingForm[]) => {
  return calculateSum(forms, (form) =>
    form.auto.climb.level === "L1" ? INCREMENT : INITIAL_COUNTER_VALUE,
  );
};

const timesClimedToLevel = (
  level: TeleClimbLevel,
  climbedLevels: TeleClimbLevel[],
) => climbedLevels.filter((currentLevel) => currentLevel === level).length;

const findTimesClimbedToLevels = (forms: ScoutingForm[]) => {
  const climbedLevels = forms.map((form) => form.tele.climb.level);
  const timeToLevels: TimesClimedToLevels = {
    L1: timesClimedToLevel("L1", climbedLevels),
    L2: timesClimedToLevel("L2", climbedLevels),
    L3: timesClimedToLevel("L3", climbedLevels),
  };
  return timeToLevels;
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
        timesClimbedToMax: findTimesClimbedToMax(
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
