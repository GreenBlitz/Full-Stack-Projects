import { Router } from "express";
import multer from "multer";
import StatusCodes from "http-status-codes";
import { runPythonScript } from "@repo/python";
import {
  DrivingData,
  drivingScoresSchema,
  fileToLogFile,
} from "@repo/drivers-types";
import { db } from "../db";

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
