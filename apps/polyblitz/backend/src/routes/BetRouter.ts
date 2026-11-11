import { Router } from "express";
import { GetBetCollection } from "../main";
import { BetSchema } from "@repo/polyblitz-types";
import { StatusCodes } from "http-status-codes";

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
