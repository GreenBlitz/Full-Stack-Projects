//בס"ד
import { ScouterInfo, TeamMatchData } from "@repo/scouting_types";
import { google } from "googleapis";
import { Db } from "mongodb";

import path from "path";
import { getDb } from "./middleware/db";
import { flow, pipe } from "fp-ts/lib/function";
import { fold, map } from "fp-ts/lib/TaskEither";
import { firstElement } from "@repo/array-functions";

const beeTeamMatchSheetsRange = "teamPerMatch";
const beeScoutersSheetsRange = "raw data";

const DIS1_SHEETS = "1-V___4ap8EHyyuqQS8m3SLbXOEmdxlOILD8gGPWott4";
const DIS2_SHEETS = "1hSeyFbC_jHAvKJ4egzjXniyr0PuuyCPVM4nVCxm9DXA";
const DCMP_SHEETS = "1fDkguEWZcUk7wBVQNIjBazM9-z_kyCCgvndGjyPMIYs";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const KEY_FILE_PATH = path.join(__dirname, "../src/sheets-key.json");

const LEADERBOARD_TEAM = "4590 - GreenBlitz";
const INCREMENT = 1;
const NOT_FOUND_INDEX = -1;

export const getBeeTeamMatchDataCollection = flow(
  getDb,
  map((db) => db.collection<TeamMatchData>("beeTeamMatchData")),
);

export const getBeeScouterCollection = flow(
  getDb,
  map((db) => db.collection<ScouterInfo>("beeScouters")),
);

const googleAuthentication = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth: googleAuthentication });

const getSheetData = async (
  spreadsheetId: string | undefined,
  range: string,
) => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return res.data.values;
};

const formatData = (data: string[][]) => {
  const keys = firstElement(data);

  return data.slice(1).map((row) => {
    const keyedData: Record<string, string> = {};

    row.forEach((current, index) => {
      keyedData[keys[index]] = current;
    });

    return keyedData;
  });
};

const fetchData = async (sheetID: string, spreadSheetsRange: string) => {
  try {
    const rawSheetData = await getSheetData(sheetID, spreadSheetsRange);

    if (!rawSheetData) {
      console.log("connection to sheets failed");
    }

    return rawSheetData;
  } catch (err) {
    console.error(`ERROR in fetch ${spreadSheetsRange} data:`, err);
    return [];
  }
};

const structureBeeTeamMatchData = (
  data: Record<string, string>[],
): TeamMatchData[] => {
  const unfilteredData = data.map((row) => {
    if (row.D_Played === "0") {
      return false;
    }
    const toBool = (v: string) => v === "1" || v === "TRUE";

    const getTeleClimb = () =>
      row.E_ClimbHeight == "low"
        ? 1
        : row.E_ClimbHeight == "mid"
          ? 2
          : row.E_ClimbHeight == "high"
            ? 3
            : 0;
    return {
      teamNumber: Number(firstElement(row.D_TeamNumber.split(" - "))),
      matchNumber: Number(row.D_MatchNumber),

      auto: {
        fuel: {
          scored: Number(row.A_FuelScored),
          passed: Number(row.A_FuelDelivered),
        },
        climb: row.A_Climb !== "Didn't",
      },

      tele: {
        fuel: {
          scored: Number(row.T_FuelScored),
          passed: Number(row.T_FuelDelivered),
        },
        climb: {
          height: getTeleClimb(),
        },
      },

      super: {
        driveLevel: Number(row.G_DrivingLevel || 0),
        didDefense: toBool(row.G_DidDefence),
        defenseLevel: Number(row.G_DefenceLevel || 0),
        didEvasions: toBool(row.G_wasDefended),
        evasionLevel: Number(row.G_CopeWithDefence || 0),
      },
      comp: row.Comp,
      notes: row.G_Comments,
      timesStole: Number(row.T_CollectionZonesOpAlliance),
    };
  });
  return unfilteredData.filter((row): row is TeamMatchData => row !== false);
};

const structureBeeScoutersData = (
  data: Record<string, string>[],
): ScouterInfo[] => {
  return data.reduce((accumulator: ScouterInfo[], row) => {
    if (row.D_ScouterTeam !== LEADERBOARD_TEAM) {
      return accumulator;
    }

    const existingIndex = accumulator.findIndex(
      (scouter) => scouter.name === row.D_ScouterName,
    );

    if (existingIndex === NOT_FOUND_INDEX) {
      accumulator.push({ name: row.D_ScouterName, scoutedMatches: INCREMENT });
      return accumulator;
    }

    return accumulator.with(existingIndex, {
      name: accumulator[existingIndex].name,
      scoutedMatches: accumulator[existingIndex].scoutedMatches + INCREMENT,
    });
  }, []);
};

const updateBeeTeamMatchData = async (db: Db, data: string[][]) => {
  try {
    const structured = structureBeeTeamMatchData(formatData(data));
    const collection = db.collection<TeamMatchData>("beeTeamMatchData");

    if (structured.length < 10) {
      console.log(
        `something went wrong - no data in new Bee a scout Team Match Data update, this is the data: ${structured}`,
      );
      return;
    }
    await collection.deleteMany({});
    await collection.insertMany(structured);

    console.log("Updated Bee a scout Team Match Data");
    return structured;
  } catch (err) {
    console.error("ERROR in Bee a scout Team Match Data update:", err);
    return [];
  }
};

const updateBeeScoutersData = async (db: Db, data: string[][]) => {
  try {
    const structured = structureBeeScoutersData(formatData(data));
    const collection = db.collection<ScouterInfo>("beeScouters");

    if (structured.length < 10) {
      console.log(
        `something went wrong - no data in new update in Bee a scout Scouters, this is the data: ${structured}`,
      );
      return;
    }
    await collection.deleteMany({});
    await collection.insertMany(structured);

    console.log("Updated Bee a scout Scouters Data");
    return structured;
  } catch (err) {
    console.error("ERROR in Bee a scout Scouters updateData:", err);
    return [];
  }
};

const MILISECONDS_IN_FIVE_MINUTES = 300000;

export const startGoogleSheetsSync = () => {
  pipe(
    getDb(),
    fold(
      (err) => async () =>
        console.error("DB connection with google sheets failed:", err.reason),
      (db) => async () => {
        const teamMatchData =
          (await fetchData(DCMP_SHEETS, beeTeamMatchSheetsRange)) ?? [];
        updateBeeTeamMatchData(db, teamMatchData);
        setInterval(
          () => updateBeeTeamMatchData(db, teamMatchData),
          MILISECONDS_IN_FIVE_MINUTES,
        );

        const scoutersData =
          (await fetchData(DCMP_SHEETS, beeScoutersSheetsRange)) ?? [];
        updateBeeScoutersData(db, scoutersData);
        setInterval(
          () => updateBeeScoutersData(db, scoutersData),
          MILISECONDS_IN_FIVE_MINUTES,
        );
      },
    ),
  )();
};
