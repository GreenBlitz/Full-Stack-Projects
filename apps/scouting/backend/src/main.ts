// בס"ד
import express from "express";
import { apiRouter } from "./routes";
import { startBeeScoutSync } from "./googleSheets";

const app = express();

const defaultPort = 4590;
const port = process.env.BACKEND_PORT ?? defaultPort;

console.log(process.env.MONGO_URI);

app.use((req, res, next) => {
  const origin = req.headers.origin ?? "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.set("query parser", "extended");
app.use(express.json());
app.use("/api/v1", apiRouter);
// startUpdatingEPAS();
startBeeScoutSync();

app.listen(port, () => {
  console.log(`Production server running at http://localhost:${port}`);
});
