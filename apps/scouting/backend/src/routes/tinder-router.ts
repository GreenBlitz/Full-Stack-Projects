//בס"ד

import { Router } from "express";
import { pipe } from "fp-ts/lib/function";
import { getFormsCollection } from "./forms-router";
import { flatMap, filterOrElse, map, fold, bindTo } from "fp-ts/lib/TaskEither";
import { flatTryCatch, foldResponse, mongofyQuery } from "@repo/flow-utils";
import { StatusCodes } from "http-status-codes";
import { excludeNoShowForms, type ScoutingForm } from "@repo/scouting_types";
import { findMaxClimbLevel } from "../climb/calculations";
import { findTimesStuckOnBump } from "../movement/stats";
import { isSingleTeam } from "../verification/functions";
import { firstElement, isEmpty, mapObject } from "@repo/array-functions";
import { groupBy } from "fp-ts/lib/NonEmptyArray";

export const tinderRouter = Router();

const createTinder = (forms: ScoutingForm[]) => ({
  climb: {
    maxClimbLevel: findMaxClimbLevel(forms),
  },
  movement: {
    stuckOnBump: findTimesStuckOnBump(forms),
  },
});

tinderRouter.get("/", (req, res) =>
  pipe(
    getFormsCollection(),
    flatTryCatch(
      (collection) => collection.find(mongofyQuery(req.query)).toArray(),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `DB Error: ${error}`,
      }),
    ),
    filterOrElse(
      (forms) => !isEmpty(forms),
      () => ({
        status: StatusCodes.BAD_REQUEST,
        reason: "Tinder Team Error: No forms match the query.",
      }),
    ),
    filterOrElse(isSingleTeam, () => ({
      status: StatusCodes.BAD_REQUEST,
      reason:
        "Tinder Team Error: Forms contain data from multiple different teams.",
    })),

    map(excludeNoShowForms),

    filterOrElse(
      (forms) => !isEmpty(forms),
      () => ({
        status: StatusCodes.BAD_REQUEST,
        reason:
          "Tinder Team Error: No valid scouting data (all matches marked no-show).",
      }),
    ),

    map(groupBy((form: ScoutingForm) => form.teamNumber.toString())),
    map((teams) => mapObject(teams, (forms) => ({ forms }))),
    map((teams) => {
      const firstTeam = firstElement(Object.values(teams));
      return createTinder(firstTeam.forms);
    }),
    bindTo("teamTinderStats"),
    foldResponse(res),
  )(),
);
