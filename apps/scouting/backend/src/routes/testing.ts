// בס"ד
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */

import { Router } from "express";
import type { Test } from "../../../common/types/Tests";
import { StatusCodes } from "http-status-codes";

const testRouter = Router();

const tests: Test[] = [];

testRouter.post("/match", (req, res) => {
  tests.push(req.body as Test);
  res.status(StatusCodes.OK).json({ message: "Added Successfully" });
});

testRouter.get("/matches", (req, res) => {
  res.status(StatusCodes.OK).json({ tests });
});
