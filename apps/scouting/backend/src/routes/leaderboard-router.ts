//בס"ד

import { Router } from "express";
import { getFormsCollection } from "./forms-router";
import { flatMap, map, tryCatch, fold } from "fp-ts/lib/TaskEither";
import { mongofyQuery } from "../middleware/query";
import { StatusCodes } from "http-status-codes";
import { pipe } from "fp-ts/lib/function";
import type { Scouter, ScoutingForm } from "@repo/scouting_types";

const INCREMENT = 1;
const NOT_FOUND_INDEX = -1;

export const leaderboardRouter = Router();

const createScouters = (forms: ScoutingForm[]): Scouter[] => {
  return forms.reduce((scouters: Scouter[], form) => {
    const scouterIndex = scouters.findIndex((s) => s.name === form.scouterName);

    if (scouterIndex === NOT_FOUND_INDEX) {
      return [
        ...scouters,
        {
          name: form.scouterName,
          scoutedCompetitions: [
            { competition: form.competition, matchCount: INCREMENT },
          ],
        },
      ];
    }

    const existingScouter = scouters[scouterIndex];
    const compIndex = existingScouter.scoutedCompetitions.findIndex(
      (scoutedCompetition) =>
        scoutedCompetition.competition === form.competition,
    );

    const updatedScoutedCompetitions =
      compIndex === NOT_FOUND_INDEX
        ? [
            ...existingScouter.scoutedCompetitions,
            { competition: form.competition, matchCount: INCREMENT },
          ]
        : existingScouter.scoutedCompetitions.map((competition, index) =>
            index === compIndex
              ? {
                  ...competition,
                  matchCount: competition.matchCount + INCREMENT,
                }
              : competition,
          );

    return scouters.map((scouter, index) =>
      index === scouterIndex
        ? { ...scouter, scoutedCompetitions: updatedScoutedCompetitions }
        : scouter,
    );
  }, []);
};

leaderboardRouter.get("/", (req, res) =>
  pipe(
    getFormsCollection(),
    flatMap((collection) =>
      tryCatch(
        () =>
          collection
            .find(mongofyQuery({ "match.type": "qualification" }))
            .toArray(),
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `DB Error: ${error}`,
        }),
      ),
    ),
    map((forms) => {
      createScouters(forms);
    }),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (scouters) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ scouters })),
    ),
  )(),
);
