// בס"ד

import express from "express";
import { apiRouter } from "./routes";
import { Collection } from "mongodb";
import { openDatabase } from "./db";
import { User, Bet } from "@repo/polyblitz-types";
import { LeaderBoardRouter as leaderBoardRouter } from "./routes/LeaderBoardRouter";
import { UserRouter as userRouter } from "./routes/UserRouter";
import { BetRouter as betRouter } from "./routes/BetRouter";

const URL = "http://localhost:3000";
const app = express();
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === URL) {
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
app.use("/api", apiRouter);

const defaultPort = 4590;
const port = process.env.BACKEND_PORT ?? defaultPort;
app.use("/Users", userRouter);
app.use("/Bet", betRouter);
app.use("/LeaderBoard", leaderBoardRouter);

let UserCollection: Collection<User> | undefined;
let BetCollection: Collection<Bet> | undefined;

async function initializeCollections() {
  const db = await openDatabase();
  UserCollection = db.collection<User>("Users");
  BetCollection = db.collection<Bet>("Bets");
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

export function GetBetCollection(): Collection<Bet> {
  if (!BetCollection) throw new Error("bet collection is not connected");
  return BetCollection;
}
