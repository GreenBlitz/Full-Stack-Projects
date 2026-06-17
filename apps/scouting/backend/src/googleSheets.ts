//בס"ד
import { BeeScoutingForm, PitScout } from "@repo/scouting_types";
import { google } from "googleapis";
import { Db } from "mongodb";

import path from "path";
import { getDb } from "./middleware/db";
import { flow, pipe } from "fp-ts/lib/function";
import { data } from "react-router-dom";
import { fold, map } from "fp-ts/lib/TaskEither";

const CHAMPS_SHEETS_ID = "1x8vQwFVIlIVrUVz2EZf3NfLTisu2PsZSCHQz7mGCYEE";
const sheetsRange = "teamPerMatch";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const KEY_FILE_PATH = path.join(__dirname, "../src/sheets-key.json");

console.log(KEY_FILE_PATH);

const googleAuthentication = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth: googleAuthentication });

const getSheetData = async (spreadsheetId: string, range: string) => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return res.data.values;
};

const formatData = (data: string[][]) => {
  const keys = data[0];

  return data.slice(1).map((row) => {
    const keyedData: Record<string, string> = {};

    row.forEach((current, index) => {
      keyedData[keys[index]] = current;
    });

    return keyedData;
  });
};

const structureData = (data: Record<string, string>[]): BeeScoutingForm[] => {
  return data.map((row) => {
    const toBool = (v: string) => v === "1" || v === "TRUE";

    const getTeleClimb = () => {
      return row.E_ClimbHeight == "low"
        ? 1
        : row.E_ClimbHeight == "mid"
          ? 2
          : row.E_ClimbHeight == "high"
            ? 3
            : 0;
    };
    return {
      teamNumber: Number(row.D_TeamNumber.split(" - ")[0]),
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
    };
  });
};

export const getBeeScoutConnection = flow(
  getDb,
  map((db) => db.collection<BeeScoutingForm>("beeScout")),
);

const updateData = async (db: Db) => {
  try {
    const raw = await getSheetData(CHAMPS_SHEETS_ID, sheetsRange);
    if (!raw) {
      console.log("No data returned from Bee A Scout google sheets");
      return [];
    }

    const structured = structureData(formatData(raw));
    const collection = db.collection<BeeScoutingForm>("beeScout");

    await collection.deleteMany({});
    await collection.insertMany(structured);

    console.log("Updated Bee A Scout Data");
    return structured;
  } catch (err) {
    console.error("ERROR in bee a scout updateData:", err);
    return [];
  }
};

const MILISECONDS_IN_FIVE_MINUTES = 30000;

export const startBeeScoutSync = () => {
  const run = pipe(
    getDb(),
    fold(
      (err) => async () => console.error("DB connection with beeScout failed:", err.reason),
      (db) => async () => {
        updateData(db);
        setInterval(() => updateData(db), MILISECONDS_IN_FIVE_MINUTES);
      },
    ),
  );

  run();
};
