import { Router } from "express";
import { GetACollection } from "../main";
import { StatusCodes } from "http-status-codes";

const LeaderBoardRouter: Router = Router();

LeaderBoardRouter.get("/leaderboard", async (req, res) => {
  try {
    const SortedUsers = GetACollection("User")
      .find()
      .sort({ money: 1 })
      .toArray();
    res.status(StatusCodes.OK).json(SortedUsers);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "finding leaderboard went wrong" });
  }
});

export default LeaderBoardRouter;
