import { Router } from "express";
import { GetACollection } from "../main";
import { UserSchema, User } from "@repo/polyblitz-types";
import { StatusCodes } from "http-status-codes";

const UserRouter: Router = Router();

async function findNewid(): Promise<number> {
  const UserIDarray = GetACollection("User")
    .find({}, { projection: { name: 0, money: 0, isAdmin: 0 } })
    .toArray();
  const usedIds = (await UserIDarray).map((user) => user.id);
  return Math.max(0, ...usedIds) + 1;
}

UserRouter.post("/User", async (req, res) => {
  const result = UserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json(result.error.issues);
    return;
  }
  try {
    const temp: User = {
      name: req.body.name,
      money: req.body.money,
      isAdmin: false,
      id: await findNewid(),
    };

    await GetACollection("User").insertOne(temp);

    res.status(StatusCodes.CREATED).json({
      message: "User received!",
    });
  } catch (error) {
    console.error("Failed to add user :", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to add user" });
  }
});

UserRouter.get("/User/:id", async (req, res) => {
  const result = UserSchema.shape.id.safeParse(Number(req.params.id));
  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json(result.error.issues);
    return;
  }
  const id = result.data;

  try {
    const User = await GetACollection("User").findOne({ id: id });
    if (!User) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
      return;
    }
    res.status(StatusCodes.OK).json(User);
  } catch (error) {
    console.error("Failed to find User:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to find User" });
  }
});

UserRouter.get("/User/:id/wagers", async (req, res) => {
  const result = UserSchema.shape.id.safeParse(Number(req.params.id));
  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json(result.error.issues);
    return;
  }
  const id = result.data;

  try {
    const User = await GetACollection("User").findOne({ id: id });
    if (!User) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
      return;
    }
    try {
      const bets = await GetACollection("Bet").find({}).toArray();
      const optionsOne = bets.map((bet) => bet.optionOne);
      const optionsTwo = bets.map((bet) => bet.optionTwo);
      const wagers = [
        optionsOne.map((option) => option.wagers),
        optionsTwo.map((option) => option.wagers),
      ];
      const userWagers = wagers.flat(2).filter((wager) => wager.userID === id);
      res.status(StatusCodes.OK).json(userWagers);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "somthing went wrong " });
    }
  } catch (error) {
    console.error("Failed to find User:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to find User" });
  }
});

export default UserRouter;
