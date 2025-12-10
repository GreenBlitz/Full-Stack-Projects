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

export const testSheets = () => {
  sheets.spreadsheets.values
    .get({ spreadsheetId: sheetID, range: "פילמנט" })
    .then((data) => {
      console.log(data.data.values);
    })
    .catch((error: unknown) => {
      console.error(error);
    });
};
