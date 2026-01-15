// בס"ד
import axios, { type AxiosRequestConfig } from "axios";
import { Router } from "express";
import {
  createBodyVerificationPipe,
  type EndpointError,
  isOK,
} from "../middleware/verification";
import { matchesProps } from "../../../common/types/TBAMatch";
import { right } from "fp-ts/lib/Either";
import type { ArrayC, Mixed, Props, Type, TypeC } from "io-ts";
import { StatusCodes } from "http-status-codes";
import { failure } from "io-ts/lib/PathReporter";
import { scoreBreakdown2025 } from "../../../common/types/ScoreBreakdown2025";
import {
  chain,
  fold,
  fromEither,
  map,
  mapLeft,
  type TaskEither,
  tryCatch,
} from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import * as t from "io-ts"

export const tbaRouter = Router();

const TBA_KEY = process.env.TBA_API_KEY ?? "yourtbakey";

const fetchTba = <U extends Props>(
  route: string,
  typeToCheck: TypeC<U>,
  config?: AxiosRequestConfig
) =>
  pipe(
    tryCatch(
      () =>
        axios.get(`https://www.thebluealliance.com/api/v3${route}`, {
          headers: { "X-TBA-Auth-Key": TBA_KEY },
          ...config,
        }),

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
  ) satisfies TaskEither<EndpointError, C>;
tbaRouter.post("/matches", (req, res) => {
  pipe(
    right(req),
    createBodyVerificationPipe(matchesProps),
    fromEither,
    chain((body) =>
      fetchTba(`/event/${body.event}/matches`, t.array(scoreBreakdown2025))
    ),
    fold((error) => res.status(error.status).send(error.reason),(matches) =>))
  );
});
