//בס"ד
import { google } from "googleapis";
import path from "path";


const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const KEY_FILE_PATH = path.join(__dirname, "../src/sheets-key.json");

console.log(KEY_FILE_PATH);

// Google Authentication
const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth });

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

async function updateData() {
  try {
    const raw = await getSheetData(CHAMPS_SHEETS_ID, "raw data");

    console.log("raw:", raw);

    if (!raw) {
      console.log("No data returned");
      return;
    }

    const formatted = formatData(raw);

    console.log(formatted);
    console.log("checking");
  } catch (err) {
    console.error("ERROR in updateData:", err);
  }
}

updateData();

console.log("checking 2");
