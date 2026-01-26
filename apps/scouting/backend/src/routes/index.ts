// בס"ד
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { tbaRouter } from "./tba";
import { gameRouter } from "./game-router";
import { formsRouter } from "./forms-router";

export const apiRouter = Router();

apiRouter.use("/forms",formsRouter);
apiRouter.use("/tba", tbaRouter);
apiRouter.use("/game", gameRouter);
apiRouter.get("/health", (req, res) => {
  res.status(StatusCodes.OK).send({ message: "Healthy!" });
});
