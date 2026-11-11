import { spawn } from "child_process";

export function runPythonScript(
  scriptPath: string,
  args: string[],
): Promise<string> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", [scriptPath, ...args]);
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
        return reject(new Error(`Python script failed: ${errorData}`));
      }
      resolve(outputData);
    });
  });
}
