// בס"ד
import axios, { type AxiosRequestConfig } from "axios";
import { type Request, Router } from "express";
import * as t from "io-ts";
import { verifyBody } from "../middleware/verification";
import {
  type MatchesProps,
  matchesProps,
} from "../../../common/types/TBAMatch";
import { StatusCodes } from "http-status-codes";

export const tbaRouter = Router();

const TBA_KEY = process.env.TBA_API_KEY ?? "yourtbakey";

const fetchTba = async <T>(
  route: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return axios.get(`https://www.thebluealliance.com/api/v3${route}`, {
    headers: { "X-TBA-KEY": TBA_KEY },
    ...config,
  });
};

tbaRouter.post(
  "/matches",
  verifyBody(matchesProps),
  (req: Request<{}, any, MatchesProps>, res) => {
    fetchTba(`/event/${req.body.event}/matches`)
      .then((value) => {
        console.log(value);
        res.status(StatusCodes.OK).json({value})
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }
);
