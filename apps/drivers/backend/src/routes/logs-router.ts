import { Router } from "express";
import multer from "multer";
import StatusCodes from "http-status-codes";
import { filter } from "@repo/type-utils";
import { runPythonScript } from "@repo/python";
import {
  DrivingData,
  drivingDataSchema,
  drivingScoresSchema,
  fileToLogFile,
} from "@repo/drivers-types";
import { db } from "../db";
import { z } from "zod";

export const logsRouter = Router();

const upload = multer({
  dest: "temp/uploads/",
  limits: { fileSize: 200 * 1024 * 1024 },
});

const drivingDataCollection = db.collection<DrivingData>("logs");
const parsingScriptPath = process.cwd() + "/scripts/wpilog_parsing/main.py";

logsRouter.post("/", upload.single("file"), async (req, res) => {
  if (req.file) {
    const logFile = fileToLogFile(req.file);

    const scriptResult = await runPythonScript(parsingScriptPath, [
      req.file.path,
    ]).catch((err) => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    });
    if (scriptResult) {
      const drivingScores = drivingScoresSchema.parse(JSON.parse(scriptResult));
      const drivingData: DrivingData = { log: logFile, scores: drivingScores };

      const insertion = await drivingDataCollection.insertOne(drivingData);
      res.sendStatus(
        insertion.acknowledged
          ? StatusCodes.CREATED
          : StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  } else {
    res.sendStatus(StatusCodes.BAD_REQUEST);
  }
});

logsRouter.get("/", async (req, res) => {
  try {
    const filterBy = z
      .deepPartial(drivingDataSchema)
      .parse(JSON.parse(req.body));

    const filteredCollection = drivingDataCollection.find(
      (drivingData: DrivingData) => filter(drivingData, filterBy),
    );
    res.status(StatusCodes.OK).send(filteredCollection);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
  }
});
