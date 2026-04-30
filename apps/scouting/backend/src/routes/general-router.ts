//בס"ד

import { Router } from "express";
import { getFormsCollection } from "./forms-router";
import { pipe } from "fp-ts/lib/function";
import { fold, map, bindTo, bind, flatMap } from "fp-ts/lib/TaskEither";
import { mongofyQuery, flatTryCatch, foldResponse } from "@repo/flow-utils";
import { StatusCodes } from "http-status-codes";

import {
  excludeNoShowForms,
  type GeneralData,
  type ScoutingForm,
} from "@repo/scouting_types";
import { findMaxClimbLevel } from "../climb/calculations";
import { calculateAverageClimbsScore } from "../climb/score";
import { groupBy } from "fp-ts/lib/NonEmptyArray";
import { fetchTeamsCOPRs } from "./tba-router";
import { calculateAverage, mapObject } from "@repo/array-functions";
import { getTeamsEPAs } from "../middleware/epa";

export const generalRouter = Router();

// const formsToGeneralData = (forms: ScoutingForm[]) => {
//   const groupedForms = groupBy((form: ScoutingForm) =>
//     form.teamNumber.toString(),
//   )(forms);

//   const allGeneralData: GeneralData[] = Object.entries(groupedForms).map(
//     ([teamNumber, teamForms]) => {
//       const generalData: GeneralData = {
//         teamNumber: Number(teamNumber),
//         highestClimbLevel: findMaxClimbLevel(teamForms),
//         avarageClimbPoints: {
//           fullGame:
//             calculateAverageClimbsScore(teamForms).auto +
//             calculateAverageClimbsScore(teamForms).tele,
//           auto: calculateAverageClimbsScore(teamForms).auto,
//           tele: calculateAverageClimbsScore(teamForms).tele,
//         },
//       };

//       return generalData;
//     },
//   );

//   return allGeneralData;
// };

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

    map(excludeNoShowForms),

    map(groupBy((form: ScoutingForm) => form.teamNumber.toString())),
    map((teams) => mapObject(teams, (forms) => ({ forms }))),
    flatMap(fetchTeamsCOPRs),
    flatMap(getTeamsEPAs),
    map((teams) =>
      Object.entries(teams).map(
        ([teamNumber, { forms, coprs, epa }]): GeneralData => ({
          teamNumber: Number(teamNumber),
          epa: epa?.breakdown.total_points ?? 0,
          opr: coprs?.totalPoints ?? 0,
          driving: calculateAverage(
            forms.filter(({ tele }) => tele.driving?.rating),
            ({ tele }) => tele.driving?.rating ?? 0,
          ),
          defense: calculateAverage(
            forms.filter(({ tele }) => tele.defense?.rating),
            ({ tele }) => tele.defense?.rating ?? 0,
          ),
          evasion: calculateAverage(
            forms.filter(({ tele }) => tele.evasion?.rating),
            ({ tele }) => tele.evasion?.rating ?? 0,
          ),
          autoFuel: calculateAverage(forms, ({ auto }) =>
            Number(auto.balls === "more" ? 150 : auto.balls),
          ),
        }),
      ),
    ),

    bindTo("generalData"),
    foldResponse(res),
  )();
});
