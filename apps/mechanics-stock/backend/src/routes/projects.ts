// בס"ד
import { Router } from "express";
import { StatusCodes } from "http-status-codes";

export const projectsRouter = Router();

projectsRouter.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({ projects: [] });
});
