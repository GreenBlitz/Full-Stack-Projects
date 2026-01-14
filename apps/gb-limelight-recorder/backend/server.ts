//בס"ד
import express from "express";
import { RecordingProcess } from "./RecordingProcess.js";
import cors from "cors";
import ping from "ping";
import fs from "fs";
import path from "path";
import { pingCameras } from "./PingRobot.js";
import { useEffect } from "react";

const app = express();
const port = 5000;
app.use(cors());

type cameraObj = {
  name: string
  camURL: string
  ffmpegProcess: RecordingProcess | null
};

const usbRoot = "E:/"; // CHANGE if needed

const leftCamObj: cameraObj = {
  name: "left",
  camURL: "http://limelight-left.local:5800",
  ffmpegProcess: null
};
const objectCamObj: cameraObj = {
  name: "object",
  camURL: "http://limelight-object.local:5800",
  ffmpegProcess: null
};
const rightCamObj: cameraObj = {
  name: "right",
  camURL: "http://limelight.local:5800",
  ffmpegProcess: null
};
const cameras: cameraObj[] = [leftCamObj, objectCamObj, rightCamObj];

function createSessionFolder(): string {
  if (!fs.existsSync(usbRoot)) {
    throw new Error("USB drive not connected");
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const sessionDir = path.join(usbRoot, `recording-${timestamp}`);

  fs.mkdirSync(sessionDir, { recursive: true });
  return sessionDir;
}

// --- HELLO ---
app.get("/", (req, res) => {
  console.log("GET / route hit");
  res.send("Welcome to the Limelight Recorder API");
});

// --- START THE SERVER ---
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

// for general use and stuff
const zero = 0;
const one = 1;
const two = 2;
const three = 3;

function startRecording() {
  if (cameras[zero].ffmpegProcess 
    || cameras[one].ffmpegProcess 
    || cameras[two].ffmpegProcess
  ) {
    return;
  }

  const sessionDir = createSessionFolder();

  for (let i = 0; i < three; i++) {
    cameras[i].ffmpegProcess = new RecordingProcess(
      cameras[i].name,
      path.join(sessionDir, `${cameras[i].name}.mp4`)
    );
    cameras[i].ffmpegProcess?.startRecording();
  }
}

function stopRecording() {
  for (let i = 0; i < three; i++) {
    if (cameras[i].ffmpegProcess) {
      cameras[i].ffmpegProcess?.stopRecording();
      cameras[i].ffmpegProcess = null;
      console.log(`Stopped recording: ${cameras[i].name}`);
    }
  }
}

const oneSecond = 1000;
useEffect(() => {
  const intervalId = setInterval(() => {
    pingCameras()
      .catch(console.error);
  }, oneSecond);

  return () => {clearInterval(intervalId)};
}, []);
