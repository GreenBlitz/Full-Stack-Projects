// בס"ד
import express from "express";
import { apiRouter } from "./routes";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use("/api/v1", apiRouter);

const defaultPort = 4590;
const port = process.env.BACKEND_PORT ?? defaultPort;
console.log(port);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
const statusBadServer = 500;
const statusGood = 200;
const statusBadUser = 400;

const apiKey: string | undefined = process.env.TBA_API_KEY;
if (apiKey === undefined) {
  throw new Error("TBA_API_KEY is not defined.");
}

// const apiKey =
//   "yLJ97mneQ9bNLVM8neE5p9APXMXXx87Q5FFWpIlGv7ht21N5ljcFcTH9BX9leRyk";

export const fetchData = async (url: string): Promise<unknown> => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-TBA-Auth-Key": apiKey,
      "Content-Type": "application/json",
    },
    mode: "cors",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log("TBA data:", data);
  return data;
};

app.get("/fetch", async (req, res) => {
  try {
    const encodedUrl = req.query.url;
    if (!encodedUrl || typeof encodedUrl !== "string") {
      res.status(statusBadUser).json({ error: "missing url param" });
      return;
    }
    const fullUrl = decodeURIComponent(encodedUrl);
    console.log("Incoming /fetch with url:", fullUrl);

    const data = await fetchData(fullUrl);
    res.status(statusGood).json(data);
  } catch (error) {
    console.error("Error in /fetch:", error);
    res.status(statusBadServer).json({ error: "Failed to fetch data" });
  }
});

app.listen(port, () => {
  console.log(`Production server running at http://localhost:${port}`);
});
