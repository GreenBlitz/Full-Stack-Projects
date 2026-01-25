// בס"ד
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { tbaRouter } from "./tba";
import { formsRouter } from "./forms";
import { gameRouter } from "./game-router";



export const apiRouter = Router();


apiRouter.use("/tba", tbaRouter);
apiRouter.use("/forms",formsRouter)
apiRouter.use("/game", gameRouter);

apiRouter.get("/health", (req, res) => {
  res.status(StatusCodes.OK).send({ message: "Healthy!" });
});

