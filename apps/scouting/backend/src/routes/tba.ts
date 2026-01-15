// בס"ד
import axios, { type AxiosRequestConfig } from "axios";
import { Router } from "express";
import {
  createBodyVerificationPipe,
  type EndpointError,
  isOK,
} from "../middleware/verification";
import { matchesProps } from "../../../common/types/TBAMatch";
import { pipe } from "fp-ts/lib/function";
import {
  chain,
  type Either,
  left,
  map,
  mapLeft,
  right,
} from "fp-ts/lib/Either";
import type { Props, TypeC } from "io-ts";
import { StatusCodes } from "http-status-codes";
import { failure } from "io-ts/lib/PathReporter";
import { scoreBreakdown2025 } from "../../../common/types/ScoreBreakdown2025";

export const tbaRouter = Router();

const TBA_KEY = process.env.TBA_API_KEY ?? "yourtbakey";

const fetchTba = async <U extends Props>(
  route: string,
  typeToCheck: TypeC<U>,
  config?: AxiosRequestConfig
) => {
  const response = await axios.get(
    `https://www.thebluealliance.com/api/v3${route}`,
    {
      headers: { "X-TBA-Auth-Key": TBA_KEY },
      validateStatus: () => true,
      ...config,
    }
  );
  return pipe(
    isOK(response.status)
      ? right(response)
      : left({
          status: response.status,
          reason: `Error Fetching From TBA: error ${response.data}`,
        }),
    chain((body) =>
      pipe(
        typeToCheck.decode(body),
        mapLeft((error) => ({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          reason: `Recieved incorrect response from the TBA. error: ${failure(error).join("\n")}`,
        }))
      )
    )
  ) satisfies Either<EndpointError, unknown>;
};

tbaRouter.post("/matches", (req) =>
  pipe(
    right(req),
    createBodyVerificationPipe(matchesProps),
    map((body) => fetchTba(`/event/${body.event}/matches`, scoreBreakdown2025))
  )
);
