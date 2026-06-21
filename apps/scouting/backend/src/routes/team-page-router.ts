//בס"ד

import { Router } from "express";
import { getBeeScoutCollection } from "../googleSheets";
import { pipe } from "fp-ts/lib/function";
import { mongofyQuery, flatTryCatch, foldResponse } from "@repo/flow-utils";
import { StatusCodes } from "http-status-codes";
import { bindTo, map } from "fp-ts/lib/TaskEither";
import { groupBy } from "fp-ts/lib/NonEmptyArray";
import { BeeScoutingForm } from "@repo/scouting_types";
import { calculateAverage, mapObject } from "@repo/array-functions";
import { calculateFuelForTeamPhase } from "./general-router";
import { TeamPageTeamBeeData } from "@repo/scouting_types";

export const teamPageRouter = Router();

const calculateTeamDataForTeam = (
  forms: BeeScoutingForm[],
): TeamPageTeamBeeData => {
  const defenseGames = forms.filter((form) => form.super.didDefense);
  const evasionGames = forms.filter((form) => form.super.didEvasions);
  const auto = {
    ...calculateFuelForTeamPhase(forms.map((form) => form.auto)),
  };
  const tele = {
    ...calculateFuelForTeamPhase(forms.map((form) => form.tele)),
  };
  const superScout = {
    defence: calculateAverage(defenseGames, (form) => form.super.defenseLevel),
    evasion: calculateAverage(evasionGames, (form) => form.super.evasionLevel),
    driving: calculateAverage(forms, (form) => form.super.driveLevel),
  };

  return {
    auto,
    tele,
    super: superScout,
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

