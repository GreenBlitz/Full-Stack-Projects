import { Router } from "express";
import { GetBetCollection, GetUserCollection } from "../main";
import { BetSchema, WagerSchema } from "@repo/polyblitz-types";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export const BetRouter: Router = Router();

async function findNewid(): Promise<number> {
  const betIDarray = GetBetCollection()
    .find({}, { projection: { name: 0, money: 0, isAdmin: 0 } })
    .toArray();
  const usedIds = (await betIDarray).map((user) => user.id);
  return Math.max(0, ...usedIds) + 1;
}

BetRouter.get("/bets", async (req, res) => {
  try {
    const bets = await GetBetCollection().find({}).toArray();
    res.status(StatusCodes.OK).json(bets);
  } catch (error) {
    console.error("Failed to get bets:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to get bets" });
  }
});

BetRouter.post("/bets", async (req, res) => {
  const result = BetSchema.omit({ id: true }).safeParse(req.body);
  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json(result.error.issues);
    return;
  }
  try {
    await GetBetCollection().insertOne({
      ...result.data,
      id: await findNewid(),
    });
    res.status(StatusCodes.CREATED).json({ message: "inserted" });
  } catch (error) {
    console.error("Failed to create bet:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to create bet" });
  }
});

BetRouter.get("/bets/:id", async (req, res) => {
  const result = BetSchema.shape.id.safeParse(Number(req.params.id));
  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json(result.error.issues);
    return;
  }
  const id = result.data;

  try {
    const bet = await GetBetCollection().findOne({ id: id });
    if (!bet) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "bet not found" });
      return;
    }
    res.status(StatusCodes.OK).json(bet);
  } catch (error) {
    console.error("Failed to find bet:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to find bet" });
  }
});

BetRouter.post("/bets/:id/wagers", async (req, res) => {
  const betIdResult = BetSchema.shape.id.safeParse(Number(req.params.id));
  if (!betIdResult.success) {
    res.status(StatusCodes.BAD_REQUEST).json(betIdResult.error.issues);
    return;
  }
  const betId = betIdResult.data;

  const wagerResult = WagerSchema.extend({
    amountWagered: z.number().positive(),
    option: z.enum(["optionOne", "optionTwo"]),
  }).safeParse(req.body);
  if (!wagerResult.success) {
    res.status(StatusCodes.BAD_REQUEST).json(wagerResult.error.issues);
    return;
  }
  const { userID, amountWagered, option } = wagerResult.data;

  try {
    const bet = await GetBetCollection().findOne({ id: betId });
    const user = await GetUserCollection().findOne({ id: userID });

    if (!bet) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "bet not found" });
      return;
    }
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "user not found" });
      return;
    }
    if (user.money < amountWagered) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "insufficient balance" });
      return;
    }

    const update =
      option === "optionOne"
        ? await GetBetCollection().updateOne(
            { id: betId },
            { $push: { "optionOne.wagers": { userID, amountWagered } } },
          )
        : await GetBetCollection().updateOne(
            { id: betId },
            { $push: { "optionTwo.wagers": { userID, amountWagered } } },
          );

    if (update.matchedCount === 0) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "bet not found" });
      return;
    }

    await GetUserCollection().updateOne(
      { id: userID },
      { $inc: { money: -amountWagered } },
    );

    res.status(StatusCodes.CREATED).json({ message: "wager placed" });
  } catch (error) {
    console.error("Failed to place wager:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to place wager" });
  }
});
