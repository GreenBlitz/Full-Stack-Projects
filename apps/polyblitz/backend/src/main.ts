// בס"ד

import express from "express";
import { apiRouter } from "./routes";
import { Collection } from "mongodb";
import { openDatabase } from "./db";
import { User, bet } from "@repo/polyblitz-types";
import LeaderBoardRouter from "./routes/LeaderBoardRouter";
import UserRouter from "./routes/UserRouter";
import BetRouter from "./routes/BetRouter";

const app = express();
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === "http://localhost:3000") {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Vary", "Origin");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});
app.use(express.json());
app.use("/api/v1", apiRouter);

const defaultPort = 4590;
const port = process.env.BACKEND_PORT ?? defaultPort;
app.use("/api/Users", UserRouter);
app.use("/api/Bet", BetRouter);
app.use("/api/LeaderBoard", LeaderBoardRouter);

let UserCollection: Collection<User> | undefined;
let BetCollection: Collection<bet> | undefined;

async function initializeCollections() {
  const db = await openDatabase();
  UserCollection = db.collection<User>("Users");
  BetCollection = db.collection<bet>("Bets");
}

async function startServer() {
  // Connect once at startup and reuse these collection handles for every request.
  await initializeCollections();
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("Backend failed to start:", error);
  process.exitCode = 1;
});

export function GetUserCollection(): Collection<User> {
  if (!UserCollection) throw new Error("User collection is not connected");
  return UserCollection;
}

export function GetBetCollection(): Collection<bet> {
  if (!BetCollection) throw new Error("bet collection is not connected");
  return BetCollection;
}
