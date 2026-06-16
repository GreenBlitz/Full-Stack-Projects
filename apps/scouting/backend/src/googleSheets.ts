//בס"ד

import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "./sheets-key.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
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
