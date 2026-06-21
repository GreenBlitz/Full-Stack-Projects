//בס"ד

import { Router } from "express";
import { formsRouter, getFormsCollection } from "./forms-router";
import { pipe } from "fp-ts/lib/function";
import { fold, map, bindTo, bind, flatMap } from "fp-ts/lib/TaskEither";
import { mongofyQuery, flatTryCatch, foldResponse } from "@repo/flow-utils";
import { StatusCodes } from "http-status-codes";

import {
  BeeScoutingForm,
  excludeNoShowForms,
  type GeneralTeamBeeData,
  type ScoutingForm,
} from "@repo/scouting_types";
import { findMaxClimbLevel } from "../climb/calculations";
import { calculateAverageClimbsScore } from "../climb/score";
import { groupBy } from "fp-ts/lib/NonEmptyArray";
import { fetchTeamsCOPRs } from "./tba-router";
import {
  calculateAverage,
  calculateSum,
  mapObject,
} from "@repo/array-functions";
import { getTeamsEPAs } from "../middleware/epa";
import { getBeeScoutCollection } from "../googleSheets";

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

const calculateGeneralForTeam = (
  forms: BeeScoutingForm[],
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
  };
};

generalRouter.get("/", async (req, res) => {
  await pipe(
    getBeeScoutCollection(),

    flatTryCatch(
      (collection) => collection.find().toArray(),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Could not get forms from DB: ${error}`,
      }),
    ),
    map(groupBy((form: BeeScoutingForm) => form.teamNumber.toString())),
    map((teamsForms) => mapObject(teamsForms, calculateGeneralForTeam)),
    bindTo("generalData"),
    foldResponse(res),
  )();
});
