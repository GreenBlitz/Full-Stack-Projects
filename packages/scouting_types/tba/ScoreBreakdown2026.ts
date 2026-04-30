// בס"ד
import * as t from "io-ts";
import { tbaMatch } from "./TBAMatch";

const climbCodec = t.keyof({
  None: null,
  Level1: null,
  Level2: null,
  Level3: null,
});

const scoreSegment = (segmentKey: string) => ({
  [`${segmentKey}Count`]: t.number,
  [`${segmentKey}Points`]: t.number,
});

const hubScoreCodec = t.type({
  ...scoreSegment("auto"),
  ...scoreSegment("teleop"),

  ...scoreSegment("transition"),
  ...scoreSegment("shift1"),
  ...scoreSegment("shift2"),
  ...scoreSegment("shift3"),
  ...scoreSegment("shift4"),
  ...scoreSegment("endgame"),
  uncounted: t.number,
});

export const scoreBreakdown2026 = t.type({
  adjustPoints: t.number,

  autoTowerPoints: t.number,
  autoTowerRobot1: climbCodec,
  autoTowerRobot2: climbCodec,
  autoTowerRobot3: climbCodec,

  endGameTowerPoints: t.number,
  endGameTowerRobot1: climbCodec,
  endGameTowerRobot2: climbCodec,
  endGameTowerRobot3: climbCodec,

  foulPoints: t.number,
  penalties: t.string,
  majorFoulCount: t.number,
  minorFoulCount: t.number,

  hubScore: hubScoreCodec,

  rp: t.number,
  energizedAchieved: t.boolean,
  superchargedAchieved: t.boolean,
  traversalAchieved: t.boolean,

  totalAutoPoints: t.number,
  totalTeleopPoints: t.number,
  totalTowerPoints: t.number,
  totalPoints: t.number,
});

export type ScoreBreakdown2026 = t.TypeOf<typeof scoreBreakdown2026>;

export const tbaMatches2026 = t.array(tbaMatch(scoreBreakdown2026, t.type({})));
export type TBAMatches2026 = t.TypeOf<typeof tbaMatches2026>;
