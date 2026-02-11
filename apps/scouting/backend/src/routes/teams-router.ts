// בס"ד

import { Router } from "express";
import { right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { createTypeCheckingEndpointFlow } from "../middleware/verification";
import {
  flatMap,
  fold,
  fromEither,
  left as taskLeft,
  right as taskRight,
  map,
  tryCatch,
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
} from "@repo/scouting_types";
import { ACCURACY_DISTANCES, teamsProps } from "@repo/scouting_types";
import { groupBy } from "fp-ts/lib/NonEmptyArray";
import { calculateSum, isEmpty, mapObject } from "@repo/array-functions";
import { createFuelObject } from "../fuel/fuel-object";
import { splitByDistances } from "../fuel/distance-split";
import { calculateFuelStatisticsOfShift } from "../fuel/fuel-general";

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

    copr: 0,
    cdpr: 0,
  };
};

const processTeam = (bpses: BPS[], forms: ScoutingForm[]): TeamData => {
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
  return { tele, auto, fullGame, metrics: { epa: 0, bps: 0 } };
};

const getBPSes = (): BPS[] => [
  {
    events: [
      {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        score: [1000, 2000, 3000],
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        shoot: [1000, 1400, 2000, 3000],
        positions: [{ x: 300, y: 200 }],
      },
    ],
    match: { type: "qualification", number: 8 },
  },
];

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
        map(({ teams }) => ({ collection, teams })),
      ),
    ),
    map(({ collection, teams }) => ({
      collection,
      teams: typeof teams === "number" ? [teams] : teams,
    })),
    flatMap(({ collection, teams }) =>
      tryCatch(
        () => collection.find({ teamNumber: { $in: teams } }).toArray(),
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Error Getting Teams From DB: ${error}`,
        }),
      ),
    ),
    flatMap((item) =>
      isEmpty(item)
        ? taskLeft({
            status: StatusCodes.BAD_GATEWAY,
            reason: `Form Array Is Empty`,
          })
        : taskRight(item),
    ),
    map(groupBy((form) => form.teamNumber.toString())),
    map((teams) => ({ teams, bpses: getBPSes() })),
    map(({ teams, bpses }) => mapObject(teams, processTeam.bind(null, bpses))),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (teams) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ teams })),
    ),
  )();
});
