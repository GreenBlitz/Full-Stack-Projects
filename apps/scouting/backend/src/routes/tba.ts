// בס"ד
import axios, { type AxiosRequestConfig } from "axios";
import { Router } from "express";
import * as t from "io-ts";
import { verifyBody } from "../middleware/verification";
import { MatchesProps, matchesProps } from "../../../common/types/TBA";

export const tbaRouter = Router();

const TBA_KEY = process.env.TBA_API_KEY ?? "yourtbakey";

const fetchTba = async <T>(
  route: string,
  config: AxiosRequestConfig
): Promise<T> => {
  return axios.get(`https://www.thebluealliance.com/api/v3${route}`, {
    headers: { "X-TBA-KEY": TBA_KEY },
    ...config,
  });
};

tbaRouter.post("/matches", verifyBody(matchesProps), (req, res) => {
  return {}
});
