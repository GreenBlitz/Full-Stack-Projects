import express, { Router } from "express";
import multer from "multer";
import { runPythonScript } from "@repo/python";
import {
  DrivingData,
  drivingScoresSchema,
  fileToLogFile,
} from "@repo/drivers-types";

export const logsRouter = Router();
logsRouter.use(express.json());

const upload = multer({
  dest: "temp/uploads/",
  limits: { fileSize: 200 * 1024 * 1024 },
});

logsRouter.post("/", upload.single("logFile"), async (req, res) => {
  if (req.file) {
    const logFile = fileToLogFile(req.file);

    const script = await runPythonScript("scripts/wpilog_parsing/main.py", [
      req.file.path,
    ]);
    const drivingScores = drivingScoresSchema.parse(JSON.parse(script));
    const drivingData: DrivingData = { log: logFile, scores: drivingScores };
  } else {
    res.sendStatus(400);
  }
});
