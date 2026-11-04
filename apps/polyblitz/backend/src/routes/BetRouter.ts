import { Router } from "express";
import { GetACollection } from "../main";
import { BetSchema } from "@repo/polyblitz-types";
import { StatusCodes } from "http-status-codes";

const BetRouter: Router = Router();

BetRouter.get("/bets", async (req, res) => {
  try {
    const bets = await GetACollection("Bet").find({}).toArray();
    res.status(StatusCodes.OK).json(bets);
  } catch (error) {
    console.error("Failed to get bets:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to get bets" });
  }
});

BetRouter.post("/bets", async (req, res) => {
  const result = BetSchema.safeParse(req.body);
  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json(result.error.issues);
    return;
  }
  try {
    await GetACollection("Bet").insertOne(result.data);
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
    const bet = await GetACollection("Bet").findOne({ id: id });
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

export default BetRouter;
