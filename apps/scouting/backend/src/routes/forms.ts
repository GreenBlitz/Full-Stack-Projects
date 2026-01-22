// בס"ד

import { Router } from "express";
import { flatMap, mapLeft, right, tryCatch } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { createTypeCheckingEndpointFlow } from "../middleware/verification";
import { scoutingFormCodec } from "@repo/scouting_types";
import { StatusCodes } from "http-status-codes";

export const formsRouter = Router();

formsRouter.post("/", (req, res) => {
  pipe(
    right(req),
    createTypeCheckingEndpointFlow(scoutingFormCodec, (error) => ({
      status: StatusCodes.BAD_REQUEST,
      reason: `Invalid Form in the body ${error}`,
    })),
    flatMap((form) =>
      tryCatch(
        () => {
          console.log(form);
        },
        () => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: "Error Inserting form into database",
        }),
      ),
    ),
    mapLeft((error) => res.status(error.status).send(error.reason)),
  );
});
