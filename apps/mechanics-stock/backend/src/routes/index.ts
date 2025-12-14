// בס"ד
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { projectsRouter } from "./projects";

export const apiRouter = Router();

apiRouter.use("/projects", projectsRouter);

apiRouter.get("/health", (req, res) => {
  res.status(StatusCodes.OK).send({ message: "Healthy!" });
});
