// בס"ד

import { Router } from "express";
import { right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { createTypeCheckingEndpointFlow } from "../middleware/verification";
import { teamsProps } from "@repo/scouting_types/teams";
import { flatMap, fold, fromEither, map, tryCatch } from "fp-ts/lib/TaskEither";
import { getFormsCollection } from "./forms-router";
import { StatusCodes } from "http-status-codes";
import { map as eitherMap } from "fp-ts/Either";
import { castItem } from "@repo/type-utils";
import type { ScoutingForm } from "@repo/scouting_types";
import { groupBy } from "fp-ts/lib/NonEmptyArray";
import { mapObject } from "@repo/array-functions";

export const teamsRouter = Router();

const processTeam = (forms: ScoutingForm[]) => {};

teamsRouter.get("/", (req, res) =>
  pipe(
    getFormsCollection(),
    flatMap((collection) =>
      pipe(
        right(req.query),
        eitherMap(castItem),
        createTypeCheckingEndpointFlow(teamsProps, (error) => ({
          status: StatusCodes.BAD_REQUEST,
          reason: `Incorrect Query Parameters: ${error}`,
        })),
        fromEither,
        map(({ teams }) => ({ collection, teams })),
      ),
    ),
    map(({ collection, teams }) =>
      collection.find({ teamNumber: { $in: teams } }).toArray(),
    ),
    flatMap((item) =>
      tryCatch(
        () => item,
        (error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Error Getting Teams From DB: ${error}`,
        }),
      ),
    ),
    map(groupBy((form) => form.teamNumber.toString())),
    map((teams) => mapObject(teams, processTeam)),
    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (teams) => () =>
        Promise.resolve(res.status(StatusCodes.OK).json({ teams })),
    ),
  ),
);
