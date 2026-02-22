// בס"ד
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { tbaRouter } from "./tba";
import { gameRouter } from "./game-router";
import { formsRouter } from "./forms-router";
import { forecastRouter } from "./forecast-router";
import { teamsRouter } from "./teams-router";
import { generalRouter } from "./general-router";
import { compareRouter } from "./compare-router";
import { bpsRouter } from "./bps-router";

export const apiRouter = Router();

apiRouter.use("/forms", formsRouter);
apiRouter.use("/tba", tbaRouter);
apiRouter.use("/game", gameRouter);
apiRouter.use("/forecast", forecastRouter);
apiRouter.use("/team",teamsRouter)
apiRouter.use("/general", generalRouter);
apiRouter.use("/compare", compareRouter);
apiRouter.use("/bps",bpsRouter);

apiRouter.get("/health", (req, res) => {
  res.status(StatusCodes.OK).send({ message: "Healthy!" });
});
