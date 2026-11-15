import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".secret.env") });

const TBA_URL = "https://www.thebluealliance.com/api/v3";
const outputPath = path.resolve(process.cwd(), "packages/frc/teams.json");

const fetchTeams = async () => {
  const apiKey = process.env.TBA_API_KEY;

  if (!apiKey) {
    throw new Error("TBA_API_KEY is required to fetch teams.");
  }

  const headers = {
    "X-TBA-Auth-Key": apiKey,
  };

  const seasonResponse = await fetch(`${TBA_URL}/status`, { headers });
  const { current_season: season } = await seasonResponse.json();

  const teamsResponse = await fetch(`${TBA_URL}/district/${season}isr/teams`, {
    headers,
  });

  if (!teamsResponse.ok) {
    throw new Error(
      `TBA teams request failed with ${teamsResponse.status} ${teamsResponse.statusText}.`,
    );
  }

  const teams = await teamsResponse.json();
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(teams, null, 2)}\n`, "utf8");

  console.log(`Wrote team data to ${outputPath}`);
};

fetchTeams().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
