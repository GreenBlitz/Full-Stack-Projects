//בס"ד
import express from "express";
import { RecordingProcess } from "./RecordingProcess.js";
import cors from "cors";
import ping from "ping";
import fs from "fs";
import path from "path";

const app = express();
const port = 5000;
app.use(cors());

let ffmpegProcessLeft: RecordingProcess | null = null;
let ffmpegProcessObject: RecordingProcess | null = null;
let ffmpegProcessRight: RecordingProcess | null = null;
const USB_ROOT = "E:/"; // CHANGE if needed

function createSessionFolder(): string {
  if (!fs.existsSync(USB_ROOT)) {
    throw new Error("USB drive not connected");
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const sessionDir = path.join(USB_ROOT, `recording-${timestamp}`);

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

  let sessionDir: string;

  try {
    sessionDir = createSessionFolder();
  } catch (err) {
    console.error(err);
    return;
  }

  ffmpegProcessLeft = new RecordingProcess(
    "left",
    path.join(sessionDir, "left.mp4")
  );
  ffmpegProcessLeft.startRecording();

  ffmpegProcessObject = new RecordingProcess(
    "object",
    path.join(sessionDir, "object.mp4")
  );
  ffmpegProcessObject.startRecording();

  ffmpegProcessRight = new RecordingProcess(
    "right",
    path.join(sessionDir, "right.mp4")
  );
  ffmpegProcessRight.startRecording();

  console.log(`Recording started in ${sessionDir}`);
}

function stopRecording() {
  // Stop left camera
  if (ffmpegProcessLeft) {
    ffmpegProcessLeft.stopRecording();
    ffmpegProcessLeft = null;
    console.log("Stopped recording: left");
  }

  // Stop object camera
  if (ffmpegProcessObject) {
    ffmpegProcessObject.stopRecording();
    ffmpegProcessObject = null;
    console.log("Stopped recording: object");
  }

  // Stop right camera
  if (ffmpegProcessRight) {
    ffmpegProcessRight.stopRecording();
    ffmpegProcessRight = null;
    console.log("Stopped recording: right");
  }
}

const oneSecond = 1000;
async function pingRobot(robotIp: string) {
  const result = await ping.promise.probe(robotIp, { timeout: 10 });
  return result;
}
// --- PING CAMERAS ---
setInterval(() => {
  async function pingCameras () {
    const robotIp = "10.45.90.2";
    const isUp = await pingRobot(robotIp).then((res) => res);

    if (isUp.alive) {
      console.log(`Robot at ${robotIp} is online.`);
      startRecording();
    }

    if (!isUp.alive) {
      console.log(`Robot at ${robotIp} is offline.`);
      stopRecording();
    }
  }
  pingCameras().catch(() => {
    console.error("Couldnt ping cameras");
  })
}, oneSecond);