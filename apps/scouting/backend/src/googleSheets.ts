//בס"ד
import { BeeScoutingForm } from "@repo/scouting_types";
import { google } from "googleapis";
import { Db } from "mongodb";

import path from "path";
import { getDb } from "./middleware/db";
import { flow, pipe } from "fp-ts/lib/function";
import { fold, map } from "fp-ts/lib/TaskEither";
import { firstElement } from "@repo/array-functions";

const sheetsRange = "teamPerMatch";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const KEY_FILE_PATH = path.join(__dirname, "../src/sheets-key.json");

export const getBeeScoutCollection = flow(
  getDb,
  map((db) => db.collection<BeeScoutingForm>("beeScout")),
);

const googleAuthentication = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth: googleAuthentication });

const getSheetData = async (spreadsheetId: string = "", range: string) => {
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

const structureData = (data: Record<string, string>[]): BeeScoutingForm[] => {
  return data.map((row) => {
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
    };
  });
};

const updateData = async (db: Db) => {
  try {
    console.log(process.env.CHAMPS_SHEETS_ID);
    const raw = await getSheetData(process.env.CHAMPS_SHEETS_ID, sheetsRange);
    if (!raw) {
      console.log("No data returned from Bee A Scout google sheets");
      return [];
    }

    const structured = structureData(formatData(raw));
    const collection = db.collection<BeeScoutingForm>("beeScout");

    if (structured.length < 10) {
      console.log(
        "something went wrong - no data in new update in Bee A Scout",
      );
      return;
    }
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
  pipe(
    getDb(),
    fold(
      (err) => async () =>
        console.error("DB connection with beeScout failed:", err.reason),
      (db) => async () => {
        updateData(db);
        setInterval(() => updateData(db), MILISECONDS_IN_FIVE_MINUTES);
      },
    ),
  )();
};
