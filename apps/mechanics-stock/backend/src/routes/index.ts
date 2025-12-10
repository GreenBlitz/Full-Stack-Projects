// בס"ד
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { testSheets } from "../middleware/sheets";

export const apiRouter = Router();

apiRouter.get("/health", (req, res) => {
  testSheets();
  res.status(StatusCodes.OK).send({ message: "Healthy!" });
});
