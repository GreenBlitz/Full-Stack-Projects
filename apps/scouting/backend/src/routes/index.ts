// בס"ד
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { testRouter } from "./testing";

export const apiRouter = Router();

apiRouter.get("/health", (req, res) => {
  res.status(StatusCodes.OK).send({ message: "Healthy!" });
});

apiRouter.use("/tests",testRouter);
