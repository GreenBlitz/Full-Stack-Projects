// בס"ד
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { logsRouter } from "./logs-router";

export const apiRouter = Router();

apiRouter.use("/logs", logsRouter);

apiRouter.get("/health", (req, res) => {
  res.status(StatusCodes.OK).send({ message: "Healthy!" });
});
