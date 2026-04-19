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
import {
  compareMatches,
  defaultTele,
  excludeNoShowForms,
  isNoShowForm,
  Movement,
  teamsProps,
  type EPA,
  type Match,
  type ScoutingForm,
  type TeamData,
  type TeamOPR,
} from "@repo/scouting_types";
import { groupBy } from "fp-ts/lib/NonEmptyArray";
import { calculateSum, isEmpty, mapObject } from "@repo/array-functions";
import { foldResponse, flatTryCatch } from "@repo/flow-utils";
import { fetchTeamsCOPRs } from "./tba-router";
import { getTeamsEPAs } from "../middleware/epa";

export const teamsRouter = Router();

const uniqueNoShowMatches = (forms: ScoutingForm[]): Match[] => {
  const seen = new Set<string>();
  const matches: Match[] = [];
  for (const form of forms) {
    if (!isNoShowForm(form)) continue;
    const key = `${form.match.type}\0${form.match.number}`;
    if (seen.has(key)) continue;
    seen.add(key);
    matches.push(form.match);
  }
  return [...matches].sort(compareMatches);
};

const addMovements = (
  movement1: Movement["ally"],
  movement2: Movement["ally"],
): Movement["ally"] => ({
  trenchPass: movement1.trenchPass + movement2.trenchPass,
  bumpStuck: movement1.bumpStuck + movement2.bumpStuck,
  bumpPass: movement1.bumpPass + movement2.bumpPass,
});

const addShifts = (
  shift1: ScoutingForm["tele"]["transitionShift"],
  shift2: ScoutingForm["tele"]["transitionShift"],
) => ({
  ally: addMovements(shift1.ally, shift2.ally),
  opponent: addMovements(shift1.opponent, shift2.opponent),
});

const collectMovementInfoOfField = (forms: ScoutingForm[]) => {
  const teles = forms.map((form) => form.tele);
  const averagePerShift = teles.reduce<ScoutingForm["tele"]>(
    (acc, tele) => ({
      transitionShift: addShifts(tele.transitionShift, acc.transitionShift),
      endgameShift: addShifts(tele.endgameShift, acc.endgameShift),
      shifts: [
        addShifts(tele.shifts[0], acc.shifts[0]),
        addShifts(tele.shifts[1], acc.shifts[1]),
        addShifts(tele.shifts[2], acc.shifts[2]),
        addShifts(tele.shifts[3], acc.shifts[3]),
      ],
      climb: acc.climb,
    }),
    defaultTele,
  );

  return {
    averagePerShift,
  };
};

export const processTeam = (
  forms: ScoutingForm[],
  coprs?: TeamOPR,
  epa?: EPA,
): TeamData => {
  const statsForms = excludeNoShowForms(forms);
  const tele = {
    movement: collectMovementInfoOfField(forms),
    climbs: statsForms.map((form) => ({
      match: form.match,
      ...form.tele.climb,
    })),
  };
  const auto = {
    climbs: statsForms.map((form) => ({
      match: form.match,
      ...form.auto.climb,
    })),
  };

  return {
    tele,
    auto,
    metrics: { epa, coprs },
    noShowMatches: uniqueNoShowMatches(forms),
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
    map((teams) => mapObject(teams, (forms) => ({ forms }))),
    flatMap(fetchTeamsCOPRs),
    flatMap(getTeamsEPAs),
    map((teams) =>
      mapObject(teams, (team) => processTeam(team.forms, team.coprs, team.epa)),
    ),
    bindTo("teams"),
    foldResponse(res),
  )();
});
