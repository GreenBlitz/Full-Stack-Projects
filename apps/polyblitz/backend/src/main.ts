// בס"ד

import express from "express";
import { apiRouter } from "./routes";
import { Collection } from "mongodb";
import { openDatabase } from "./db";
import { User, bet, BetSchema, UserSchema } from "@repo/polyblitz-types";

const app = express();
app.use(express.json());

const defaultPort = 4590;
const port = process.env.BACKEND_PORT ?? defaultPort;

let UserCollection: Collection<User> | undefined;
let BetCollection: Collection<bet> | undefined;

async function initializeCollections() {
  const db = await openDatabase();
  UserCollection = db.collection<User>("Users");
  BetCollection = db.collection<bet>("Bets");
}

async function startServer() {
  initializeCollections();
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

app.use("/api/v1", apiRouter);

startServer().catch((error: unknown) => {
  console.error("Backend failed to start:", error);
  process.exitCode = 1;
});

function getUserCollection(): Collection<User> {
  if (!UserCollection) throw new Error("User collection is not connected");
  return UserCollection;
}

function getBetCollection(): Collection<bet> {
  if (!BetCollection) throw new Error("bet collection is not connected");
  return BetCollection;
}
