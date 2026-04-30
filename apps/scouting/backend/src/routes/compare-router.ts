//בס"ד

import {
  excludeNoShowForms,
  type ScoutingForm,
  type TeleClimbLevel,
  type TimesClimedToLevels,
} from "@repo/scouting_types";
import { Router } from "express";
import { getFormsCollection } from "./forms-router";
import { pipe } from "fp-ts/lib/function";
import { bind, bindTo, filterOrElse, fold, map } from "fp-ts/lib/TaskEither";
import { mongofyQuery, flatTryCatch, foldResponse } from "@repo/flow-utils";
import { StatusCodes } from "http-status-codes";
import { calculateSum, firstElement, isEmpty } from "@repo/array-functions";
import { isSingleTeam } from "../verification/functions";

export const compareRouter = Router();

const INITIAL_COUNTER_VALUE = 0;
const INCREMENT = 1;

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
    flatTryCatch(
      async (collection) => collection.find(mongofyQuery(req.query)).toArray(),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `DB Error: ${error}`,
      }),
    ),
    filterOrElse(
      (forms) => !isEmpty(forms),
      () => ({
        status: StatusCodes.BAD_REQUEST,
        reason: "Compare Two Validation Error: No forms match the query.",
      }),
    ),
    map(excludeNoShowForms),
    filterOrElse(
      (forms) => !isEmpty(forms),
      () => ({
        status: StatusCodes.BAD_REQUEST,
        reason:
          "Compare Two Validation Error: No valid scouting data (all matches marked no-show).",
      }),
    ),
    filterOrElse(isSingleTeam, () => ({
      status: StatusCodes.BAD_REQUEST,
      reason:
        "Compare Two Validation Error: Forms contain data from multiple different teams.",
    })),
    bindTo("teamForms"),
    map(({ teamForms }) => ({
      teamNumber: firstElement(teamForms).teamNumber,
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

    bindTo("teamCompareData"),
    foldResponse(res),
  )();
});
