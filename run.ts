import process from "process";
import { execSync } from "child_process";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: [
    path.resolve(process.cwd(), ".public.env"),
    path.resolve(process.cwd(), ".secret.env"),
  ].filter(Boolean) as string[],
});

execSync(`pm2 kill `, {
  stdio: "inherit",
  env: { ...process.env },
});

execSync(`pm2 start backend/dist/bundle.js --name "backend" --update-env `, {
  stdio: "inherit",
  env: { ...process.env },
});

execSync(
  `pm2 start frontend/start.ts --name "frontend" --interpreter "tsx" --update-env`,
  {
    stdio: "inherit",
    env: { ...process.env },
  },
);
