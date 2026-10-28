// בס"ד

import express from "express";
import { apiRouter } from "./routes";
import { Collection } from "mongodb";
import { openDatabase } from "./db";
import type { User, bet } from "@repo/polyblitz-types";

const app = express();

const defaultPort = 4590;
const port = process.env.BACKEND_PORT ?? defaultPort;

let UserCollection: Collection<User> | undefined;
let BetCollection: Collection<bet> | undefined;

async function startServer() {
  const db = await openDatabase();
  UserCollection = db.collection<User>("Users");
  BetCollection = db.collection<bet>("Bets");
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

app.use("/api/v1", apiRouter);

startServer().catch((error: unknown) => {
  console.error("Backend failed to start:", error);
  process.exitCode = 1;
});
