// בס"ד
import { Router, type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import { fetchTba } from "../utils/tbaClient";

const tbaRouter = Router();

const tbaHandler =
  (pathBuilder: (req: Request) => string) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const path = pathBuilder(req);
      const data = await fetchTba(path);
      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      console.error("Error in tba handler:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Failed to fetch data" });
    }
  };

tbaRouter.get(
  "/events/:eventKey/teams",
  tbaHandler((req) => `/event/${req.params.eventKey}/teams/simple`)
);

tbaRouter.get(
  "/events/:eventKey/matches",
  tbaHandler((req) => `/event/${req.params.eventKey}/matches/simple`)
);

tbaRouter.get(
  "/events/:eventKey/rankings",
  tbaHandler((req) => `/event/${req.params.eventKey}/rankings`)
);

export { tbaRouter, tbaHandler };
