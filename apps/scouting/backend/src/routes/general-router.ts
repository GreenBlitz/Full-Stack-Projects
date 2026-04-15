//בס"ד

import { Router } from "express";
import { getFormsCollection } from "./forms-router";
import { pipe } from "fp-ts/lib/function";
import { fold, map, bindTo, bind } from "fp-ts/lib/TaskEither";
import { mongofyQuery, flatTryCatch } from "@repo/flow-utils";
import { StatusCodes } from "http-status-codes";

import {
  EPA,
  excludeNoShowForms,
  TeamOPR,
  type BPS,
  type GeneralData,
  type ScoutingForm,
  type TeamNumberAndFuelData,
} from "@repo/scouting_types";
import { findMaxClimbLevel } from "../climb/calculations";
import { calculateAverageClimbsScore } from "../climb/score";
import { formsToFuelData } from "../fuel/fuel-general";
import { getAllBPSes } from "./bps-router";
import { isEmpty } from "@repo/array-functions";
import { findTimesMovementEvent } from "../movement/stats";
import { fetchTeamsCOPRs } from "./tba-router";
import { getTeamsEPAs } from "../middleware/epa";
import { calculateTotalGamePoints } from "../game/calculations";

export const generalRouter = Router();

const formsToGeneralData = (
  forms: ScoutingForm[],
  bpses: Record<string, BPS[]>,
  coprs?: TeamOPR,
  epa?: EPA,
) => {
  const calculatedFuel: TeamNumberAndFuelData = formsToFuelData(bpses)(forms);

  const allGeneralData: GeneralData[] = Object.entries(calculatedFuel).map(
    (teamNumberAndFuelData) => {
      const [teamNumber, fuelData] = teamNumberAndFuelData;
      const teamForms = forms.filter(
        (form) => form.teamNumber.toString() === teamNumber,
      );
      const resultOPR = {} as TeamOPR;
      const resultEPA = {} as EPA;

      fetchTeamsCOPRs({ teamNumber: resultOPR });
      getTeamsEPAs({ teamNumber: resultEPA });

      const generalData: GeneralData = {
        teamNumber: Number(teamNumber),
        fuelData: fuelData,
        avarageClimbPoints: {
          fullGame:
            calculateAverageClimbsScore(teamForms).auto +
            calculateAverageClimbsScore(teamForms).tele,
          auto: calculateAverageClimbsScore(teamForms).auto,
          tele: calculateAverageClimbsScore(teamForms).tele,
          highestClimbLevel: findMaxClimbLevel(teamForms),
        },
        copr: resultOPR.fuelTotal,
        movement: {
          passTrenchCount: findTimesMovementEvent(teamForms, "trenchPass"),
          passBumpCount: findTimesMovementEvent(teamForms, "bumpPass"),
          stuckBumpCount: findTimesMovementEvent(teamForms, "bumpStuck"),
        },
        epa: resultEPA.breakdown.total_points,
        averagePointsPerMatch: calculateTotalGamePoints(
          teamForms,
          bpses[teamNumber],
        ),
      };

      return generalData;
    },
  );

  return allGeneralData;
};

generalRouter.get("/", async (req, res) => {
  await pipe(
    getFormsCollection(),
    flatTryCatch(
      (collection) => collection.find(mongofyQuery(req.query)).toArray(),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `DB Error: ${error}`,
      }),
    ),

    bindTo("forms"),
    map(({ forms }) => ({ forms: excludeNoShowForms(forms) })),
    bind("teamBpses", ({ forms }) => getAllBPSes(forms)),
    map(({ forms, teamBpses }) => ({
      forms: forms.filter((form) => !isEmpty(teamBpses[form.teamNumber])),
      teamBpses,
    })),

    map(({ forms, teamBpses }) => formsToGeneralData(forms, teamBpses)),

    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (generalData) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ generalData })),
    ),
  )();
});
