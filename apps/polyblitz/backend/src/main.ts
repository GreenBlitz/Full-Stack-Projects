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

async function findNewid(): Promise<number> {
  const UserIDarray = getUserCollection()
    .find({}, { projection: { name: 0, money: 0, isAdmin: 0 } })
    .toArray();
  const usedIds = (await UserIDarray).map((user) => user.id);

  let counter = 1;
  while (usedIds.find((num) => num === counter)) {
    counter++;
  }

  return counter;
}

app.post("/User", async (req, res) => {
  const result = UserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.issues);
    return;
  }
  try {
    const temp: User = {
      name: result.data.name,
      money: result.data.money,
      isAdmin: false,
      id: await findNewid(),
    };

    await getUserCollection().insertOne(temp);

    res.status(201).json({
      message: "User received!",
    });
  } catch (error) {
    console.error("Failed to add user :", error);
    res.status(500).json({ message: "Failed to add bet" });
  }
});

app.get("/User/:id", async (req, res) => {
  const result = UserSchema.shape.id.safeParse(req);
  let id = 0;
  if (result.success) {
    id = result.data;
  } else {
    res.json(result.error.issues);
    return;
  }

  try {
    const User = await getUserCollection().findOne({ id: id });
    if (!User) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(User);
  } catch (error) {
    console.error("Failed to find Duck:", error);
    res.status(500).json({ message: "Failed to find User" });
  }
});

async function getWagerArrayByid(id: number) {
  const bets = await getBetCollection().find({}).toArray();
  const optionsOne = bets.map((bet) => bet.optionOne);
  const optionsTwo = bets.map((bet) => bet.optionTwo);
  const wager = [
    optionsOne.map((option) => option.wagers),
    optionsTwo.map((option) => option.wagers),
  ];
  return wager.flat(2).filter((wager) => wager.userID === id);
}

app.get("/User/:id/wagers", async (req, res) => {
  const result = UserSchema.shape.id.safeParse(req);
  let id = 0;
  if (result.success) {
    id = result.data;
  } else {
    res.json(result.error.issues);
    return;
  }

  try {
    const User = await getUserCollection().findOne({ id: id });
    if (!User) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    try {
      res.status(200).json(getWagerArrayByid(id));
    } catch (error) {
      res.json({ message: "failed to open data base" });
    }
  } catch (error) {
    console.error("Failed to find User:", error);
    res.status(500).json({ message: "Failed to find User" });
  }
});

app.get("/bets", async (req, res) => {
  try {
    const bets = await getBetCollection().find({}).toArray();
    res.status(200).json(bets);
  } catch (error) {
    console.error("Failed to get bets:", error);
    res.status(500).json({ message: "Failed to get bets" });
  }
});

app.post("/bets", async (req, res) => {
  const result = BetSchema.safeParse(req);
  if (!result.success) {
    res.json(result.error.issues);
    return;
  }
  try {
    const inserted = await getBetCollection().insertOne(result.data);
    res.status(201).json(inserted);
  } catch (error) {
    console.error("Failed to create bet:", error);
    res.status(500).json({ message: "Failed to create bet" });
  }
});

app.get("/bets/:id", async (req, res) => {
  const result = BetSchema.shape.id.safeParse(req);
  let id = 0;
  if (result.success) {
    id = result.data;
  } else {
    res.json(result.error.issues);
    return;
  }
  try {
    const bet = await getUserCollection().findOne({ id: id });
    if (!bet) {
      res.status(404).json({ message: "bet not found" });
      return;
    }
    res.json(bet);
  } catch (error) {
    console.error("Failed to find bet:", error);
    res.status(500).json({ message: "Failed to find bet" });
  }
});

app.get("/leaderboard", async (req, res) => {
  try {
    const SortedUsers = getUserCollection().find().sort({ money: 1 }).toArray();
    res.json(SortedUsers);
  } catch (error) {
    res.json({ message: "finding leaderboard went wrong" });
  }
});
