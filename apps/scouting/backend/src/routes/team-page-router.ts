//בס"ד

import { Router } from "express";
import { getBeeScoutCollection } from "../googleSheets";
import { pipe } from "fp-ts/lib/function";
import { mongofyQuery, flatTryCatch, foldResponse } from "@repo/flow-utils";
import { StatusCodes } from "http-status-codes";
import { bindTo, map } from "fp-ts/lib/TaskEither";
import { groupBy } from "fp-ts/lib/NonEmptyArray";
import { BeeScoutingForm } from "@repo/scouting_types";
import { firstElement, mapObject } from "@repo/array-functions";
import { calculateGeneralForTeam } from "./general-router";
import { TeamPageTeamBeeData } from "@repo/scouting_types";

export const teamPageRouter = Router();

const findDataOverMatches = (
  section: "auto" | "tele" | "super" | "total",
  type: "scored" | "passed" | "defenseLevel" | "evasionLevel",
  forms: BeeScoutingForm[],
): Record<string, number> => {
  if (section === "super") {
    return Object.fromEntries(
      forms.map((form) => [form.matchNumber, form[section][type]]),
    );
  }
  if (section === "total") {
    return Object.fromEntries(
      forms.map((form) => [
        form.matchNumber,
        form.auto.fuel[type] + form.tele.fuel[type],
      ]),
    );
  }
  return Object.fromEntries(
    forms.map((form) => [form.matchNumber, form[section].fuel[type]]),
  );
};

const calculateTeamDataForTeam = (
  forms: BeeScoutingForm[],
  recency: number,
): TeamPageTeamBeeData => {
  const recentForms = forms
    .sort((formA, formB) => formA.matchNumber - formB.matchNumber)
    .slice(-recency);

  const teamAverages = calculateGeneralForTeam(
    recentForms,
    firstElement(recentForms).teamNumber.toString(),
  );

  return {
    auto: {
      fuelAverage: {
        passed: teamAverages.auto.fuelPassed,
        scored: teamAverages.auto.fuelScored,
      },
      fuelPerGame: {
        fuelScoredPerGame: findDataOverMatches("auto", "scored", recentForms),
        fuelPassedPerGame: findDataOverMatches("auto", "passed", recentForms),
      },
    },
    tele: {
      fuelAverage: {
        passed: teamAverages.tele.fuelPassed,
        scored: teamAverages.tele.fuelScored,
      },
      fuelPerGame: {
        fuelScoredPerGame: findDataOverMatches("tele", "scored", recentForms),
        fuelPassedPerGame: findDataOverMatches("tele", "passed", recentForms),
      },
    },
    total: {
      fuelAverage: {
        passed: teamAverages.auto.fuelPassed + teamAverages.tele.fuelPassed,
        scored: teamAverages.auto.fuelScored + teamAverages.tele.fuelScored,
      },
      fuelPerGame: {
        fuelScoredPerGame: findDataOverMatches("total", "scored", recentForms),
        fuelPassedPerGame: findDataOverMatches("total", "passed", recentForms),
      },
    },
    super: {
      defense: teamAverages.super.defenseRating,
      evasion: teamAverages.super.evasionRating,
      driving: teamAverages.super.driving,
      defensePerGame: findDataOverMatches("super", "defenseLevel", recentForms),
      evasionPerGame: findDataOverMatches("super", "evasionLevel", recentForms),
    },
    notes: forms.map((form) => form.notes),
  };
};

const parseRecency = (recencyString: string) =>
  parseInt(recencyString ?? "100");

teamPageRouter.get("/matches/:recency", async (req, res) => {
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
    map((teamsForms) =>
      mapObject(teamsForms, (forms) =>
        calculateTeamDataForTeam(forms, parseRecency(req.params.recency)),
      ),
    ),
    bindTo("teamPageData"),
    foldResponse(res),
  )();
});

teamPageRouter.get("/teamNumbers", async (req, res) => {
  await pipe(
    getBeeScoutCollection(),
    flatTryCatch(
      (collection) => collection.find(mongofyQuery({})).toArray(),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `DB Error: ${error}`,
      }),
    ),
    map((forms) => forms.map((form) => Number(form.teamNumber))),
    map((numbers) => [...new Set(numbers)]),
    bindTo("teamNumbers"),
    foldResponse(res),
  )();
});
