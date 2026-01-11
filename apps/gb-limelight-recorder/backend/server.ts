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

const ffmpegProcessLeft: RecordingProcess | null = null;
const ffmpegProcessObject: RecordingProcess | null = null;
const ffmpegProcessRight: RecordingProcess | null = null;
const ffmpegProcesses = [
  ffmpegProcessLeft as RecordingProcess | null, 
  ffmpegProcessObject as RecordingProcess | null, 
  ffmpegProcessRight as RecordingProcess | null,
];
const cameraNames = ["left", "object", "right"];
const usbRoot = "E:/"; // CHANGE if needed

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

function startRecording() {
  if (ffmpegProcessLeft || ffmpegProcessObject || ffmpegProcessRight) {
    return;
  }

  const sessionDir = createSessionFolder();

  for (let i = 0; i < ffmpegProcesses.length; i++) {
    ffmpegProcesses[i] = new RecordingProcess(
      cameraNames[i],
      path.join(sessionDir, `${cameraNames[i]}.mp4`)
    );
    ffmpegProcesses[i]?.startRecording();
  }
}

function stopRecording() {
  for (let i = 0; i < ffmpegProcesses.length; i++) {
    if (ffmpegProcesses[i]) {
      ffmpegProcesses[i]?.stopRecording();
      ffmpegProcesses[i] = null;
      console.log(`Stopped recording: ${cameraNames[i]}`);
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
