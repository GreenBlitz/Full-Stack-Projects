// בס"ד

import { Router } from "express";
import { right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { createTypeCheckingEndpointFlow } from "../middleware/verification";
import { teamsProps } from "@repo/scouting_types/teams";
import { flatMap, fromEither, map } from "fp-ts/lib/TaskEither";
import { getFormsCollection } from "./forms-router";
import { castItem } from "../middleware/query";
import { StatusCodes } from "http-status-codes";
import { map as eitherMap } from "fp-ts/Either";

export const teamsRouter = Router();

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
      collection.find({ teamNumber: { $in: teams } }),
    ),
  ),
);
