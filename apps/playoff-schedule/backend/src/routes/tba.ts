// בס"ד
import { Router, type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import { fetchTba } from "../utils/tbaClient";

export const tbaRouter = Router();

const createTbaHandler = (name: string, suffix?: string) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const path = `/event/${req.params.eventKey}/${name}${suffix ? `/${suffix}` : ''}`;
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
  createTbaHandler("teams", "simple")
);

tbaRouter.get(
  "/events/:eventKey/matches",
  createTbaHandler("matches", "simple")
);

tbaRouter.get(
  "/events/:eventKey/rankings",
  createTbaHandler("rankings")
);

tbaRouter.get(
  "/events/:eventKey/alliances",
  createTbaHandler("alliances")
);
