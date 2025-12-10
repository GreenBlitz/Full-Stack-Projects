// בס"ד
import { google } from "googleapis";
import path from "path";

const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
const keyFilePath = path.join(__dirname, "../mechanics-stock-keys.json");

const sheetID = process.env.SHEET_ID ?? "";

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes,
});

const sheets = google.sheets({ version: "v4", auth });

export const getSheetRangeValues = async (range: string): Promise<any[][]> =>
  sheets.spreadsheets.values
    .get({ spreadsheetId: sheetID, range })
    .then((data) => data.data.values ?? []);
