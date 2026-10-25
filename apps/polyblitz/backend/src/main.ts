// בס"ד

import express from "express";
import { apiRouter } from "./routes";
import { Collection } from "mongodb";
import { openDatabase } from "./userDB";
import type {
  User,
  UserSchema,
  bet,
  BetOption,
  BetOptionSchema,
  BetSchema,
  Wager,
  WagerSchema,
} from "@repo/polyblitz-types";

const app = express();

const defaultPort = 4590;
const port = process.env.BACKEND_PORT ?? defaultPort;

async function startServer() {
  const db = await openDatabase();
  UserCollection = db.collection<User>("Users");
  BetCollection = db.collection<bet>("Bets");
  const port = Number(process.env.BACKEND_PORT ?? defaultPort);
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

let UserCollection: Collection<User> | undefined;
let BetCollection: Collection<bet> | undefined;

app.use("/api/v1", apiRouter);
startServer().catch((error: unknown) => {
  console.error("Backend failed to start:", error);
  process.exitCode = 1;
});
