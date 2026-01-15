// בס"ד
import express from "express";
import { apiRouter } from "./routes";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from monorepo root
const rootDir = path.resolve(__dirname, "../..");
dotenv.config({ path: path.join(rootDir, ".dev.env") });
dotenv.config({ path: path.join(rootDir, ".public.env") });
dotenv.config({ path: path.join(rootDir, ".secret.env") });

const app = express();

// Register middleware before routes
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/v1", apiRouter);

const defaultPort = 4590;
const port = process.env.BACKEND_PORT ?? defaultPort;

const apiKey: string | undefined = process.env.TBA_API_KEY;
if (apiKey === undefined) {
  throw new Error("TBA_API_KEY is not defined.");
}

app.listen(port, () => {
  console.log(`Production server running at http://localhost:${port}`);
});
