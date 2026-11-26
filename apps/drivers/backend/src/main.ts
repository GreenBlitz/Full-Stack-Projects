// בס"ד
import cors from "cors";
import express from "express";
import { apiRouter } from "./routes";
import { indexDrivingDataCollection } from "./routes/logs-router";

const app = express();

const defaultPort = 4590;
const port = process.env.BACKEND_PORT ?? defaultPort;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/api/v1", apiRouter);

indexDrivingDataCollection().catch((err) =>
  console.error("Failed to index driving data collection: ", err),
);

app.listen(port, () => {
  console.log(`Production server running at http://localhost:${port}`);
});
