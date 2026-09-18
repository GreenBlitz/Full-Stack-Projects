//בס"ד

import { Router } from "express";
import { pipe } from "fp-ts/lib/function";
import { bindTo, map } from "fp-ts/lib/TaskEither";
import { flatTryCatch, foldResponse } from "@repo/flow-utils";
import { StatusCodes } from "http-status-codes";

import { type GeneralTeamBeeData, TeamMatchData } from "@repo/scouting_types";
import { groupBy } from "fp-ts/lib/NonEmptyArray";
import {
  calculateAverage,
  calculateSum,
  mapObject,
} from "@repo/array-functions";
import { getTeamMatchDataCollection } from "../googleSheets";
import { applyRecency } from "./team-page-router";

export const generalRouter = Router();

export const calculateFuelForTeamPhase = (
  phaseForms: { fuel: { scored: number; passed: number } }[],
) => ({
  fuelScored: calculateAverage(phaseForms, (forms) => forms.fuel.scored),
  fuelPassed: calculateAverage(phaseForms, (forms) => forms.fuel.passed),
});

const AUTO_NO_CLIMB_POINTS = 0;
const AUTO_CLIMB_POINTS = 15;
const TELE_CLIMB_LEVEL_POINTS = 10;

export const calculateGeneralForTeam = (
  forms: TeamMatchData[],
  team: string,
): GeneralTeamBeeData => {
  const auto = {
    ...calculateFuelForTeamPhase(forms.map((form) => form.auto)),
    climbPoints: calculateAverage(forms, (form) =>
      form.auto.climb ? AUTO_CLIMB_POINTS : AUTO_NO_CLIMB_POINTS,
    ),
  };
  const tele = {
    ...calculateFuelForTeamPhase(forms.map((form) => form.tele)),
    climbPoints: calculateAverage(
      forms,
      (form) => form.tele.climb.height * TELE_CLIMB_LEVEL_POINTS,
    ),
  };

  const defenseGames = forms.filter((form) => form.super.didDefense);
  const evasionGames = forms.filter((form) => form.super.didEvasions);

  return {
    team,
    auto,
    tele,
    full: {
      fuelScored: auto.fuelScored + tele.fuelScored,
      fuelPassed: auto.fuelPassed + tele.fuelPassed,
      climbPoints: auto.climbPoints + tele.climbPoints,
    },
    super: {
      driving: calculateAverage(forms, (form) => form.super.driveLevel),
      defenseRating: calculateAverage(
        defenseGames,
        (form) => form.super.defenseLevel,
      ),
      timesDefended: defenseGames.length,
      evasionRating: calculateAverage(
        evasionGames,
        (form) => form.super.evasionLevel,
      ),
      timesEvaded: evasionGames.length,
    },
    timesPlayed: forms.length,
    timesStole: calculateSum(forms, (form) => form.timesStole),
  };
};

export const getTotalGeneralData = (recency: number) =>
  pipe(
    getTeamMatchDataCollection(),

    flatTryCatch(
      (collection) => collection.find().toArray(),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Could not get forms from DB: ${error}`,
      }),
    ),
    map(groupBy((form: TeamMatchData) => form.teamNumber.toString())),
    map((teamsForms) =>
      mapObject(teamsForms, (forms) => applyRecency(forms, recency)),
    ),
    map((teamsForms) => mapObject(teamsForms, calculateGeneralForTeam)),
    bindTo("generalData"),
  );

generalRouter.get("/:recency", async (req, res) => {
  await pipe(
    getTotalGeneralData(parseInt(req.params.recency)),
    foldResponse(res),
  )();
});
