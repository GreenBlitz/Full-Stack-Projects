// בס"ד
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { tbaRouter } from "./tba-router";
import { gameRouter } from "./game-router";
import { formsRouter } from "./forms-router";
import { forecastRouter } from "./forecast-router";
import { teamsRouter } from "./teams-router";
import { generalRouter } from "./general-router";
import { leaderboardRouter } from "./leaderboard-router";
import { compareRouter } from "./compare-router";
import { tinderRouter } from "./tinder-router";

export const apiRouter = Router();

apiRouter.use("/forms", formsRouter);
apiRouter.use("/tba", tbaRouter);
apiRouter.use("/game", gameRouter);
apiRouter.use("/forecast", forecastRouter);
apiRouter.use("/team", teamsRouter);
apiRouter.use("/general", generalRouter);
apiRouter.use("/leaderboard", leaderboardRouter);
apiRouter.use("/compare", compareRouter);
apiRouter.use("/tinder", tinderRouter);

apiRouter.get("/health", (req, res) => {
  res.status(StatusCodes.OK).send({ message: "Healthy!" });
});
