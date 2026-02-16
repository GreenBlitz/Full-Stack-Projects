//בס"ד

import { Router } from "express";
import { getFormsCollection } from "./forms-router";
import { flatMap, map, tryCatch } from "fp-ts/lib/TaskEither";
import { mongofyQuery } from "../middleware/query";
import { StatusCodes } from "http-status-codes";
import { pipe } from "fp-ts/lib/function";
import type { ScoutingForm } from "@repo/scouting_types";

export const leaderboardRouter = Router();

const createScouters = (forms: ScoutingForm[]) => {
  forms.forEach((form) => {});
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
  ),
);
