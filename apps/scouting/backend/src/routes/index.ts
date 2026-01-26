// בס"ד
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { tbaRouter } from "./tba";
import { formsRouter } from "./forms";
import { gameRouter } from "./game-router";
import { serialize } from "@repo/serde";
import {
  type ScoutingForm,
  scoutingFormSerde,
  serdeAuto,
  serdeTele,
} from "@repo/scouting_types";

export const apiRouter = Router();

apiRouter.use("/tba", tbaRouter);
apiRouter.use("/forms", formsRouter);
apiRouter.use("/game", gameRouter);

apiRouter.get("/health", (req, res) => {
  res.status(StatusCodes.OK).send({ message: "Healthy!" });
});

const form: ScoutingForm = {
  scouterName: "Yoni",
  matchNumber: 4,
  matchType: "qualification",
  teamNumber: 4590,
  auto: {
    movement: { trenchPass: false, bumpPass: false, bumpStuck: false },
    chosenAuto: "trenchFuelMiddle",
    climb: {
      climbTime: {
        L1: { start: 0, end: 262143 },
        L2: { start: 0, end: 262143 },
        L3: { start: 0, end: 262143 },
      },
      climbSide: "middle",
      level: "L0",
    },
    shootEvents: [],
  },
  tele: {
    transitionShift: { shootEvents: [] },
    shifts: [
      {
        shootEvents: [
          {
            interval: { start: 58977, end: 59921 },
            startPosition: { x: 217, y: 161 },
          },
        ],
      },
      { shootEvents: [] },
      { shootEvents: [] },
      { shootEvents: [] },
    ],
    endgameShift: { shootEvents: [] },
    movement: { bumpStuck: false },
    climb: {
      climbTime: {
        L1: { start: 0, end: 262143 },
        L2: { start: 0, end: 262143 },
        L3: { start: 0, end: 262143 },
      },
      climbSide: "middle",
      level: "L0",
    },
  },
  comment: "Sigma",
};
console.log(serialize(scoutingFormSerde.serializer, form));
