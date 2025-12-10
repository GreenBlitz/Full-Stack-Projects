//בס"ד
import express from "express";
import { RecordingProcess } from "./RecordingProcess.js";
import cors from "cors";
import ping from "ping";

const app = express();
const port = 5000;
app.use(cors());

let ffmpegProcessLeft: RecordingProcess | null = null;
let ffmpegProcessObject: RecordingProcess | null = null;
let ffmpegProcessRight: RecordingProcess | null = null;

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
  // Start left camera
  if (!ffmpegProcessLeft) {
    ffmpegProcessLeft = new RecordingProcess(
      "left",
      "../test-vids/test-recording-left.mp4",
    );
    ffmpegProcessLeft.startRecording();
    console.log("Started recording: left");
  }

  // Start object camera
  if (!ffmpegProcessObject) {
    ffmpegProcessObject = new RecordingProcess(
      "object",
      "../test-vids/test-recording-object.mp4",
    );
    ffmpegProcessObject.startRecording();
    console.log("Started recording: object");
  }

  // Start right camera
  if (!ffmpegProcessRight) {
    ffmpegProcessRight = new RecordingProcess(
      "right",
      "../src/test-vids/test-recording-right.mp4",
    );
    ffmpegProcessRight.startRecording();
    console.log("Started recording: right");
  }
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