// בס"ד
import axios, { type AxiosRequestConfig } from "axios";
import { Router } from "express";
import {
  createBodyVerificationPipe,
  type EndpointError,
} from "../middleware/verification";
import { matchesProps } from "@repo/scouting_types";
import { right } from "fp-ts/lib/Either";
import { StatusCodes } from "http-status-codes";
import { failure } from "io-ts/lib/PathReporter";
import { scoreBreakdown2025 } from "@repo/scouting_types";
import {
  chain,
  fold,
  fromEither,
  mapLeft,
  type TaskEither,
  tryCatch,
} from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import * as t from "io-ts";
import type { MixedType } from "@repo/type_verification";

export const tbaRouter = Router();

const TBA_KEY = process.env.TBA_API_KEY ?? "yourtbakey";

const fetchTba = <U>(
  route: string,
  typeToCheck: MixedType<U>,
  config?: AxiosRequestConfig
) =>
  pipe(
    tryCatch(
      () =>
        axios
          .get(`https://www.thebluealliance.com/api/v3${route}`, {
            headers: { "X-TBA-Auth-Key": TBA_KEY },
            ...config,
          })
          .then((response) => response.data),

      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Error Fetching From TBA: error ${error}`,
      })
    ),
    chain((body) =>
      pipe(
        typeToCheck.decode(body),
        fromEither,
        mapLeft((error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Recieved incorrect response from the TBA. error: ${failure(error).join("\n")}`,
        }))
      )
    )
  ) satisfies TaskEither<EndpointError, unknown>;
tbaRouter.post("/matches", async (req, res) => {
  await pipe(
    right(req),
    createBodyVerificationPipe(matchesProps),
    fromEither,
    chain((body) =>
      fetchTba(`/event/${body.event}/matches`, t.array(scoreBreakdown2025))
    ),
    fold(
      (error) => async () => res.status(error.status).send(error.reason),
      (matches) => async () => res.status(StatusCodes.OK).json({ matches })
    )
  )();
});
