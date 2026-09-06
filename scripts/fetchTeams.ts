import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".dev.env") });

const TBA_URL = "https://www.thebluealliance.com/api/v3/district/2026isr/teams";
const outputPath = path.resolve(
  process.cwd(),
  "apps/scouting/frontend/data/teams.json",
);

const fetchTeams = async () => {
  const apiKey = process.env.TBA_API_KEY;

  if (!apiKey) {
    throw new Error("TBA_API_KEY is required to fetch teams.");
  }

  const response = await fetch(TBA_URL, {
    headers: { "X-TBA-Auth-Key": apiKey },
  });

  if (!response.ok) {
    throw new Error(
      `TBA request failed with ${response.status} ${response.statusText}.`,
    );
  }

  const teams = await response.json();
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(teams, null, 2)}\n`, "utf8");

  console.log(`Wrote team data to ${outputPath}`);
};

fetchTeams().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
