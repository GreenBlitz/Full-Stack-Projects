// בס"ד

import { Router } from "express";
import { right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { createTypeCheckingEndpointFlow } from "@repo/type-utils";
import {
  flatMap,
  fold,
  fromEither,
  left as taskLeft,
  right as taskRight,
  map,
  tryCatch,
  bindTo,
} from "fp-ts/lib/TaskEither";
import { getFormsCollection } from "./forms-router";
import { StatusCodes } from "http-status-codes";
import { castItem } from "@repo/type-utils";
import type {
  BPS,
  Match,
  ScoutingForm,
  SectionTeamData,
  Shift,
  TeamData,
  TeamOPR,
} from "@repo/scouting_types";
import { ACCURACY_DISTANCES, teamsProps } from "@repo/scouting_types";
import { groupBy } from "fp-ts/lib/NonEmptyArray";
import { calculateSum, isEmpty, mapObject } from "@repo/array-functions";
import { createFuelObject } from "../fuel/fuel-object";
import { splitByDistances } from "../fuel/distance-split";
import { calculateFuelStatisticsOfShift } from "../fuel/fuel-general";
import { calculateAverageBPS } from "../fuel/calculations/fuel-averaging";
import { getTeamBPSes } from "./bps-router";
import { foldResponse, flatTryCatch } from "@repo/flow-utils";
import { compareMatches } from "@repo/scouting_types";
import { fetchTeamsCOPRs } from "./tba-router";
import { EPA } from "@repo/scouting_types";
import { getTeamsEPAs } from "../middleware/epa";

export const teamsRouter = Router();

interface SectionForm {
  match: Match;
  shifts: Shift[];
}

const processFuelAndAccuracy = (
  forms: SectionForm[],
  bpses: BPS[],
): SectionTeamData => {
  return {
    fuel: forms.map((form) => ({
      match: form.match,
      ...calculateFuelStatisticsOfShift(form.match, bpses, form.shifts),
    })),
    accuracy: splitByDistances(
      forms.flatMap((form) =>
        form.shifts
          .flatMap((shift) => shift.shootEvents)
          .map((event) => createFuelObject(event, form.match, bpses)),
      ),
      ACCURACY_DISTANCES,
    ),
  };
};

export const processTeam = (
  bpses: BPS[],
  forms: ScoutingForm[],
  coprs?: TeamOPR,
  epa?: EPA,
): TeamData => {
  const tele = {
    movement: {
      bumpStuck: calculateSum(forms, (form) =>
        Number(form.tele.movement.bumpStuck),
      ),
    },
    climbs: forms.map((form) => ({ match: form.match, ...form.tele.climb })),
    ...processFuelAndAccuracy(
      forms.map((form) => ({
        match: form.match,
        shifts: [
          form.tele.transitionShift,
          form.tele.endgameShift,
          ...form.tele.shifts,
        ],
      })),
      bpses,
    ),
  };
  const auto = {
    movement: {
      bumpStuck: calculateSum(forms, (form) =>
        Number(form.auto.movement.bumpStuck),
      ),
      bumpPass: calculateSum(forms, (form) =>
        Number(form.auto.movement.bumpPass),
      ),
      trenchPass: calculateSum(forms, (form) =>
        Number(form.auto.movement.trenchPass),
      ),
    },
    climbs: forms.map((form) => ({ match: form.match, ...form.auto.climb })),
    ...processFuelAndAccuracy(
      forms.map((form) => ({
        match: form.match,
        shifts: [form.auto],
      })),
      bpses,
    ),
  };
  const fullGame = processFuelAndAccuracy(
    forms.map((form) => ({
      match: form.match,
      shifts: [
        form.auto,
        form.tele.transitionShift,
        ...form.tele.shifts,
        form.tele.endgameShift,
      ],
    })),
    bpses,
  );
  return {
    tele,
    auto,
    fullGame,
    metrics: { epa, bps: calculateAverageBPS(bpses), coprs },
  };
};

const compareForms = (form1: ScoutingForm, form2: ScoutingForm) =>
  compareMatches(form1.match, form2.match);

const NO_RECENCY_STARTING_INDEX = 0;

teamsRouter.get("/", async (req, res) => {
  await pipe(
    getFormsCollection(),
    flatMap((collection) =>
      pipe(
        req.query,
        castItem,
        right,
        createTypeCheckingEndpointFlow(teamsProps, (error) => ({
          status: StatusCodes.BAD_REQUEST,
          reason: `Incorrect Query Parameters: ${error}`,
        })),
        fromEither,
        map(({ teams, recency }) => ({ collection, teams, recency })),
      ),
    ),
    map(({ collection, teams, recency }) => ({
      collection,
      teams: typeof teams === "number" ? [teams] : teams,
      recency,
    })),
    flatTryCatch(
      async ({ collection, teams, recency }) => ({
        recency,
        forms: await collection.find({ teamNumber: { $in: teams } }).toArray(),
      }),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Error Getting Teams From DB: ${error}`,
      }),
    ),
    flatMap((item) =>
      isEmpty(item.forms)
        ? taskLeft({
            status: StatusCodes.BAD_GATEWAY,
            reason: `Form Array Is Empty`,
          })
        : taskRight(item),
    ),
    map(({ forms, recency }) => ({
      recency,
      teamedForms: groupBy<ScoutingForm>((form) => form.teamNumber.toString())(
        forms,
      ),
    })),
    map(({ teamedForms, recency }) =>
      mapObject(teamedForms, (forms) =>
        forms
          .sort(compareForms)
          .slice(
            recency && recency < forms.length
              ? forms.length - recency
              : NO_RECENCY_STARTING_INDEX,
          ),
      ),
    ),
    flatMap(getTeamBPSes),
    flatMap(fetchTeamsCOPRs),
    flatMap(getTeamsEPAs),
    map((teams) =>
      mapObject(teams, (team) =>
        processTeam(team.bpses, team.forms, team.coprs, team.epa),
      ),
    ),
    bindTo("teams"),
    foldResponse(res),
  )();
});
