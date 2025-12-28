// בס"ד
import axios, { type AxiosRequestConfig } from "axios";
import { Router } from "express";
import * as t from "io-ts";
import { verifyBody } from "../middleware/verification";

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

const matchesProps = t.type({
  event: t.string,
});

type MatchesProps = t.Type<typeof matchesProps>;



tbaRouter.post("/matches", verifyBody(matchesProps), (req, res) => {
  const body: MatchesProps = req.body as unknown;
});
