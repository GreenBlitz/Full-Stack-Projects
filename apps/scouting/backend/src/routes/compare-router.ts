//בס"ד

import type { ScoutingForm, TeleClimbLevel } from "@repo/scouting_types";
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
import { firstElement, isEmpty } from "@repo/array-functions";
import { calcAverageGeneralFuelData } from "./general-router";
import { generalCalculateFuel } from "../fuel/fuel-general";
import { getBPSes } from "./teams-router";

export const compareRouter = Router();

type GamePeriod = "auto" | "fullGame";

const DIGITS_AFTER_DOT = 2;
const INITIAL_COUNTER_VALUE = 0;
const INCREMENT = 1;

const calculateAverageScoredFuel = (
  forms: ScoutingForm[],
  gamePeriod: GamePeriod,
) => {
  const generalFuelData = forms.map((form) =>
    generalCalculateFuel(form, getBPSes()),
  );
  const averagedFuelData = calcAverageGeneralFuelData(generalFuelData);

  return Number(averagedFuelData[gamePeriod].scored.toFixed(DIGITS_AFTER_DOT));
};

const findMaxClimbLevel = (forms: ScoutingForm[]) => {
  const fullGameClimbedLevels = forms
    .map((form) => form.tele.climb.level)
    .concat(forms.map((form) => form.auto.climb.level));
  return "L3" in fullGameClimbedLevels
    ? "L3"
    : "L2" in fullGameClimbedLevels
      ? "L2"
      : "L1" in fullGameClimbedLevels
        ? "L1"
        : "L0";
};

const findTimesClimbedToMax = (
  forms: ScoutingForm[],
  maxLevel: TeleClimbLevel,
) => {
  return forms.reduce(
    (counter, form) =>
      form.tele.climb.level === maxLevel ? counter + INCREMENT : counter,
    INITIAL_COUNTER_VALUE,
  );
};

const findTimesClimbedInAuto = (forms: ScoutingForm[]) => {
  return forms.reduce(
    (counter, form) => (form.auto.climb.level === "L1" ? counter++ : counter),
    INITIAL_COUNTER_VALUE,
  );
};

const timesClimedToLevel = (
  level: TeleClimbLevel,
  climbedLevels: TeleClimbLevel[],
) => {
  return climbedLevels.filter((currentLevel) => currentLevel === level).length;
};

const findTimesClimbedToLevels = (forms: ScoutingForm[]) => {
  const climbedLevels = forms.map((form) => form.tele.climb.level);
  return {
    L1: timesClimedToLevel("L1", climbedLevels),
    L2: timesClimedToLevel("L2", climbedLevels),
    L3: timesClimedToLevel("L3", climbedLevels),
  };
};

compareRouter.get("/teams", (req, res) => {
  pipe(
    getFormsCollection(),
    flatMap((collection) =>
      tryCatch(
        () =>
          collection
            .find(mongofyQuery({ "match.type": "qualification" }))
            .toArray(),
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `DB Error: ${error}`,
        }),
      ),
    ),
    map((forms) => forms.map((form) => form.teamNumber)),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (teamNumbers) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ teamNumbers })),
    ),
  );
});

compareRouter.get("/", (req, res) => {
  pipe(
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
      avarageFuelInGame: calculateAverageScoredFuel(teamForms, "fullGame"),
      averageFuelInAuto: calculateAverageScoredFuel(teamForms, "auto"),
      maxClimbLevel: findMaxClimbLevel(teamForms),
      timesClimbedToMax: findTimesClimbedToMax(
        teamForms,
        findMaxClimbLevel(teamForms),
      ),
      timesClimbedInAuto: findTimesClimbedInAuto(teamForms),
      timesClimbedToLevels: findTimesClimbedToLevels(teamForms),
    })),

    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (teamCompareData) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ teamCompareData })),
    ),
  );
});
