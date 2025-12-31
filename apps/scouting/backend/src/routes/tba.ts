// בס"ד
import axios, { type AxiosRequestConfig } from "axios";
import { type Request, Router } from "express";
import { verifyBody } from "../middleware/verification";
import {
  type TBAMatch,
  type TBAMatchesProps,
  matchesProps,
} from "../../../common/types/TBAMatch";
import { StatusCodes } from "http-status-codes";
import type { ScoreBreakdown2025 } from "../../../common/types/ScoreBreakdown2025";

export const tbaRouter = Router();

const TBA_KEY = process.env.TBA_API_KEY ?? "yourtbakey";

const fetchTba = async <T>(
  route: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return axios
    .get(`https://www.thebluealliance.com/api/v3${route}`, {
      headers: { "X-TBA-Auth-Key": TBA_KEY },
      ...config,
    })
    .then((value) => value.data as T);
};

tbaRouter.post(
  "/matches",
  verifyBody(matchesProps),
  (req: Request<any, any, TBAMatchesProps>, res) => {
    fetchTba<TBAMatch<ScoreBreakdown2025>>(`/event/${req.body.event}/matches`)
      .then((value) => {
        console.log(value);
        res.status(StatusCodes.OK).json({ value });
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }
);
