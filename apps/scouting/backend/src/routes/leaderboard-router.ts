//בס"ד

import { Router } from "express";
import { getFormsCollection } from "./forms-router";
import {
  flatMap,
  map,
  tryCatch,
  fold,
  filterOrElse,
} from "fp-ts/lib/TaskEither";
import { mongofyQuery } from "../middleware/query";
import { StatusCodes } from "http-status-codes";
import { pipe } from "fp-ts/lib/function";
import type {
  CompetitionLeaderboard,
  Scouter,
  ScoutingForm,
} from "@repo/scouting_types";
import { firstElement, isEmpty } from "@repo/array-functions";

const INCREMENT = 1;
const NOT_FOUND_INDEX = -1;

export const leaderboardRouter = Router();

const createLeaderboard = (
  forms: ScoutingForm[],
): CompetitionLeaderboard | null => {
  if (isEmpty(forms)) return null;

  const competitionName = firstElement(forms).competition;

  const scouters = forms.reduce((accumulator: Scouter[], form) => {
    const existingIndex = accumulator.findIndex(
      (scouter) => scouter.name === form.scouterName,
    );

    if (existingIndex === NOT_FOUND_INDEX) {
      return [
        ...accumulator,
        { name: form.scouterName, scoutedMatches: INCREMENT },
      ];
    }

    return accumulator.map((scouter, index) =>
      index === existingIndex
        ? { ...scouter, scoutedMatches: scouter.scoutedMatches + INCREMENT }
        : scouter,
    );
  }, []);

  return {
    competition: competitionName,
    Scouters: scouters,
  };
};

leaderboardRouter.get("/", (req, res) =>
  pipe(
    getFormsCollection(),
    flatMap((collection) =>
      tryCatch(
        () => collection.find(mongofyQuery(req.query)).toArray(),
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `DB Error: ${error}`,
        }),
      ),
    ),

    filterOrElse(
      (forms: ScoutingForm[]) => {
        if (isEmpty(forms)) return true;
        const firstComp = firstElement(forms).competition;
        return forms.every((form) => form.competition === firstComp);
      },
      () => ({
        status: StatusCodes.BAD_REQUEST,
        reason:
          "Leaderboard Validation Error: Forms contain data from multiple different competitions.",
      }),
    ),

    map((forms) => createLeaderboard(forms)),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (competitionScouters) => () =>
        Promise.resolve(
          res.status(StatusCodes.OK).json({ competitionScouters }),
        ),
    ),
  )(),
);
