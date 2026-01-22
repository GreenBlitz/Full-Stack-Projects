// בס"ד
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { Router } from "express";
import {
  createBodyVerificationPipe,
  createTypeCheckingEndpointFlow,
  type EndpointError,
} from "../middleware/verification";
import { matchesProps, tbaMatch } from "@repo/scouting_types";
import { right } from "fp-ts/lib/Either";
import { StatusCodes } from "http-status-codes";
import { scoreBreakdown2025 } from "@repo/scouting_types";
import {
  flatMap,
  fold,
  type TaskEither,
  fromEither,
  tryCatch,
} from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { map } from "fp-ts/lib/Task";
import * as t from "io-ts";
import type { Type } from "io-ts";

export const tbaRouter = Router();

const TBA_KEY = process.env.TBA_API_KEY ?? "yourtbakey";
const TBA_URL = "https://www.thebluealliance.com/api/v3";

const fetchTba = <U>(
  route: string,
  typeToCheck: Type<U, unknown>,
  config?: AxiosRequestConfig
) =>
  pipe(
    tryCatch(
      () =>
        axios
          .get(TBA_URL + route, {
            headers: { "X-TBA-Auth-Key": TBA_KEY },
            ...config,
          })
          .then((response) => response.data as unknown),
      (error) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Error Fetching From TBA: error ${error}`,
      })
    ),
    map(
      createTypeCheckingEndpointFlow(typeToCheck, (errors) => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: `Received incorrect response from the TBA. error: ${errors}`,
      }))
    )
  ) satisfies TaskEither<EndpointError, U>;

tbaRouter.post("/matches", async (req, res) => {
  await pipe(
    right(req),
    createBodyVerificationPipe(matchesProps),
    fromEither,
    flatMap((body) => fetchTba(
      `/event/${body.event}/matches`,
      t.array(tbaMatch(scoreBreakdown2025, t.type({})))
    )
    ),
    fold(
      (error) => () => new Promise((resolve) => {
        resolve(res.status(error.status).send(error.reason));
      }),
      (matches) => () => new Promise((resolve) => {
        resolve(res.status(StatusCodes.OK).json({ matches }));
      })
    )
  )();
});
