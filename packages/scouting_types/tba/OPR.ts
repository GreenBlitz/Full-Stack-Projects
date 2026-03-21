// בס"ד

import { flipRecord, mapObject } from "@repo/array-functions";
import * as t from "io-ts";

export const COPR_TO_TBA_COPR = {
  fuelTotal: "Hub Total Fuel Count",

  fuelAuto: "Hub Auto Fuel Count",
  fuelTele: "Hub Teleop Fuel Count",
  fuelEndgame: "Hub Endgame Fuel Count",

  fuelTransition: "Hub Transition Fuel Count",
  fuelFirstActive: "Hub First Active Shift Count",
  fuelSecondActive: "Hub Second Active Shift Count",

  fuelShift1: "Hub Shift 1 Fuel Count",
  fuelShift2: "Hub Shift 2 Fuel Count",
  fuelShift3: "Hub Shift 3 Fuel Count",
  fuelShift4: "Hub Shift 4 Fuel Count",

  climbAuto: "autoTowerPoints",
  climbEndgame: "endGameTowerPoints",

  rp: "rp",
  rpEnergized: "energizedAchieved",
  rpSuperCharged: "superchargedAchieved",
  rpTraversal: "traversalAchieved",

  foulPoints: "foulPoints",
  g206Penalty: "g206Penalty",
  majorFoulCount: "majorFoulCount",
  minorFoulCount: "minorFoulCount",

  totalPoints: "totalPoints",
  totalAutoPoints: "totalAutoPoints",
  totalTeleopPoints: "totalTeleopPoints",
  totalClimbPoints: "totalTowerPoints",

  uncounted: "Hub Uncounted",
  adjustPoints: "adjustPoints",
} as const;

export const TBA_COPR_TO_COPR = flipRecord(COPR_TO_TBA_COPR);

export const teamOPRCodec = t.type({
  teamNumber: t.number,
  ...mapObject(COPR_TO_TBA_COPR, () => t.union([t.number, t.undefined])),
});

const stringToNumberCodec = t.record(t.string, t.number);

export const eventOPRCodec = t.type({
  ...mapObject(TBA_COPR_TO_COPR, () =>
    t.union([t.undefined, stringToNumberCodec]),
  ),
});
export type TeamOPR = t.TypeOf<typeof teamOPRCodec>;

export const oprPropsCodec = t.type({ event: t.string });
