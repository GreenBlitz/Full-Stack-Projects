//בס"ד

import { Router } from "express";
import { getBeeScoutCollection } from "../googleSheets";
import { pipe } from "fp-ts/lib/function";
import { mongofyQuery, flatTryCatch, foldResponse } from "@repo/flow-utils";
import { StatusCodes } from "http-status-codes";
import { bindTo, map } from "fp-ts/lib/TaskEither";
import { groupBy } from "fp-ts/lib/NonEmptyArray";
import { BeeScoutingForm } from "@repo/scouting_types";
import {
  calculateAverage,
  firstElement,
  mapObject,
} from "@repo/array-functions";
import {
  calculateFuelForTeamPhase,
  calculateGeneralForTeam,
} from "./general-router";
import { TeamPageTeamBeeData } from "@repo/scouting_types/rebuilt/beeAScout/teamPage";

export const teamPageRouter = Router();

const findDataOverMatches = (
  period: "auto" | "tele",
  type: "scored" | "passed",
  forms: BeeScoutingForm[],
): Record<string, number> =>
  Object.fromEntries(
    forms.map((form) => [form.matchNumber, form[period].fuel[type]]),
  );

const calculateTeamDataForTeam = (
  forms: BeeScoutingForm[],
): TeamPageTeamBeeData => {
  const teamAverages = calculateGeneralForTeam(
    forms,
    firstElement(forms).teamNumber.toString(),
  );

  return {
    auto: {
      fuelAverage: {
        passed: teamAverages.auto.fuelPassed,
        scored: teamAverages.auto.fuelScored,
      },
      fuelPerGame: {
        fuelScoredPerGame: findDataOverMatches("auto", "scored", forms),
        fuelPassedPerGame: findDataOverMatches("auto", "passed", forms),
      },
    },
    tele: {
      fuelAverage: {
        passed: teamAverages.tele.fuelPassed,
        scored: teamAverages.tele.fuelScored,
      },
      fuelPerGame: {
        fuelScoredPerGame: findDataOverMatches("tele", "scored", forms),
        fuelPassedPerGame: findDataOverMatches("tele", "passed", forms),
      },
    },
    super: {
      defense: teamAverages.super.defenseRating,
      evasion: teamAverages.super.evasionRating,
      driving: teamAverages.super.driving,
    },
  };
};

teamPageRouter.get("/", async (req, res) => {
  await pipe(
    getBeeScoutCollection(),
    flatTryCatch(
      (Collection) => Collection.find(mongofyQuery(req.query)).toArray(),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `error fetching data from DB in teamPage ${error}`,
      }),
    ),
    map(groupBy((form: BeeScoutingForm) => form.teamNumber.toString())),
    map((teamsForms) => mapObject(teamsForms, calculateTeamDataForTeam)),
    bindTo("teamPageData"),
    foldResponse(res),
  )();
});
