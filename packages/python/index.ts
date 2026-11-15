import { spawn } from "child_process";

export function runPythonScript(
  scriptPath: string,
  args: string[],
): Promise<string> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", [scriptPath, ...args]);
    pythonProcess.on("error", (error) => {
      if (error.message.includes("ENOENT")) {
        return reject("Python is not installed or not in PATH");
      } else {
        return reject(`Python script failed to start: ${error.message}`);
      }
    });
    let outputData = "";
    let errorData = "";
    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });
    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return reject(`Python script failed: ${errorData}`);
      }
      resolve(outputData);
    });
  });
}
