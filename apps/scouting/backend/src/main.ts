// בס"ד
import express from "express";
import { apiRouter } from "./routes";
import { startBeeScoutSync } from "./googleSheets";

const app = express();

const defaultPort = 4590;
const port = process.env.BACKEND_PORT ?? defaultPort;

console.log(process.env.MONGO_URI);

app.set("query parser", "extended");
app.use(express.json());
app.use("/api/v1", apiRouter);
// startUpdatingEPAS();
startBeeScoutSync();

app.listen(port, () => {
  console.log(`Production server running at http://localhost:${port}`);
});
