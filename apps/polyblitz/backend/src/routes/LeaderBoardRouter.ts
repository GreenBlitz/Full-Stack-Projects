import { Router } from "express";
import { GetUserCollection } from "../main";
import { StatusCodes } from "http-status-codes";

export const LeaderBoardRouter: Router = Router();

LeaderBoardRouter.get("/leaderboard", async (req, res) => {
  try {
    const sortedUsers = await GetUserCollection()
      .find()
      .sort({ money: -1 })
      .toArray();
    res.status(StatusCodes.OK).json(sortedUsers);
  } catch (error) {
    console.error("Failed to get leaderboard:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "finding leaderboard went wrong" });
  }
});
