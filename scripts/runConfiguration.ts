import process from "process";
import { execSync } from "child_process";
import dotenv from "dotenv";
import path from "path";

const environment = process.argv[2];
const workspace = process.argv[3];
const isDev = environment === "dev";

dotenv.config({
  path: [
    isDev && path.resolve(process.cwd(), ".dev.env"),
    path.resolve(process.cwd(), ".public.env"),
    path.resolve(process.cwd(), ".secret.env"),
  ].filter(Boolean) as string[],
});

console.log("running workspace", workspace, "in", environment);
execSync(`turbo run ${environment} --filter=${workspace}*`, {
  stdio: "inherit",
  env: { ...process.env },
});

