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
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("Backend failed to start:", error);
  process.exitCode = 1;
});

// Hey Karni, you are probably wondering what I did here, so I will tell you.
// Inserting into the DB doesn't work if the function returns a union type for some reason,
//  so I asked the AI to fix it. It added this, which changes the output type based on the input.
export function GetACollection(name: "User"): Collection<User>;
export function GetACollection(name: "Bet"): Collection<bet>;
export function GetACollection(
  name: "User" | "Bet",
): Collection<User> | Collection<bet> {
  if (name === "User") {
    if (!UserCollection) throw new Error("User collection is not connected");
    return UserCollection;
  }

  if (!BetCollection) throw new Error("Bet collection is not connected");
  return BetCollection;
}
