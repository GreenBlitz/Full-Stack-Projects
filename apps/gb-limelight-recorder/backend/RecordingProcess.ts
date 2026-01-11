//בס"ד
import type { ChildProcess } from "child_process";
import { spawn } from "child_process";
import { timeStamp } from "console";
import ffmpegPath from "ffmpeg-static";

class RecordingProcess {
  public ffmpegProcess: ChildProcess | null = null;
  public cameraUrl: string;
  public outputFile: string;
  
  // --- CONSTRUCTOR ---
  public constructor(cameraUrl: string, outputFile: string) {
    const time: Date = new Date();
    this.outputFile = outputFile
      + "/timestamp_"
      + time.getHours()
      + ":"
      + time.getMinutes()
      + ".mp4";

    this.cameraUrl =
      cameraUrl === "left" ? "http://limelight-left.local:5800"
    : cameraUrl === "object" ? "http://limelight-object.local:5800"
    : cameraUrl === "right" ? "http://limelight.local:5800"
    : cameraUrl;
  }

  
  // --- START RECORDING ---
  public startRecording(): string {
    if (this.ffmpegProcess) {
      return "Recording already running";
    }
    console.log(ffmpegPath);

    // Process initiations
    this.ffmpegProcess = spawn(ffmpegPath as unknown as string, [
      "-i",
      this.cameraUrl,
      "-c:v",
      "copy",
      this.outputFile,
    ]);

    // Logging
    this.ffmpegProcess.stderr?.on("data", (data) => {
      console.log(data.toString());
    });

    // Send response
    return "Recording started";
  }

  // --- STOP RECORDING ---
  public stopRecording(): string {
    if (!this.ffmpegProcess) {
      return "No recording running";
    }

    this.ffmpegProcess.stdin?.write("q");
    this.ffmpegProcess.stdin?.end();
    this.ffmpegProcess = null;
    
    return "Recording stopped"
  }
}

export { RecordingProcess };