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

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const apiKey: string | undefined = process.env.TBA_API_KEY;
if (apiKey === undefined) {
  throw new Error("TBA_API_KEY is not defined.");
}

app.listen(port, () => {
  console.log(`Production server running at http://localhost:${port}`);
});
