import { Router } from "express";
import { GetBetCollection, GetUserCollection } from "../main";
import { UserSchema, User } from "@repo/polyblitz-types";
import { StatusCodes } from "http-status-codes";

export const UserRouter: Router = Router();

async function findNewid(): Promise<number> {
  const UserIDarray = GetUserCollection()
    .find({}, { projection: { name: 0, money: 0, isAdmin: 0 } })
    .toArray();
  const usedIds = (await UserIDarray).map((user) => user.id);
  return Math.max(0, ...usedIds) + 1;
}

UserRouter.post("/User", async (req, res) => {
  const resultName = UserSchema.shape.name.safeParse(req.body.name);
  if (!resultName.success) {
    res.status(StatusCodes.BAD_REQUEST).json(resultName.error.issues);
    return;
  }
  const resultPass = UserSchema.shape.password.safeParse(req.body.password);
  if (!resultPass.success) {
    res.status(StatusCodes.BAD_REQUEST).json(resultPass.error.issues);
    return;
  }
  try {
    const temp: User = {
      name: req.body.name,
      password: req.body.password,
      money: 250,
      isAdmin: false,
      id: await findNewid(),
    };

    await GetUserCollection().insertOne(temp);

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
    const User = await GetUserCollection().findOne({ id: id });
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
  const NUMBER_OF_ARRAYS_IN_WAGER = 2;
  const result = UserSchema.shape.id.safeParse(Number(req.params.id));
  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json(result.error.issues);
    return;
  }
  const id = result.data;

  try {
    const User = await GetUserCollection().findOne({ id: id });
    if (!User) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
      return;
    }
    try {
      const bets = await GetBetCollection().find({}).toArray();
      const optionsOne = bets.map((bet) => bet.optionOne);
      const optionsTwo = bets.map((bet) => bet.optionTwo);
      const wagers = [
        optionsOne.map((option) => option.wagers),
        optionsTwo.map((option) => option.wagers),
      ];
      const userWagers = wagers
        .flat(NUMBER_OF_ARRAYS_IN_WAGER)
        .filter((wager) => wager.userID === id);
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
