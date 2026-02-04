//בס"ד
/* eslint-disable @typescript-eslint/no-magic-numbers */ //for the example bps

import { Router } from "express";
import { getCollection } from "./forms-router";
import { pipe } from "fp-ts/lib/function";
import { fold, map } from "fp-ts/lib/TaskEither";
import { mongofyQuery } from "../middleware/query";
import { generalCalculateFuel } from "../fuel/fuel-general";
import type { BPS } from "../fuel/fuel-object";
import { StatusCodes } from "http-status-codes";

export const generalRouter = Router();

const EXAMPLE_BPS: BPS[] = [
  {
    match: {
      number: 42,
      type: "qualification",
    },
    events: [
      {
        shoot: [12, 45, 88, 110],
        score: [12, 88],
      },
      {
        shoot: [135, 140],
        score: [135, 140],
      },
    ],
  },
];

generalRouter.get("/", (req, res) => {
  pipe(
    getCollection(),
    map((collection) => collection.find(mongofyQuery(req.query)).toArray()),
    map(
      async (forms) =>
        (await forms).map((form) => {
          generalCalculateFuel(form, EXAMPLE_BPS);
        }),
      //write a way to get only the avarages
      forEach((calculatedFuel) => {}),
    ),

    fold(
      (error) => () =>
        Promise.resolve(res.status(error.status).send(error.reason)),
      (calculatedFuel) => async () =>
        res
          .status(StatusCodes.OK)
          .json({ calculatedFuel: await calculatedFuel }),
    ),
  );
});
