// בס"ד
import * as t from "io-ts";

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

  foulCount: t.number,
  foulPoints: t.number,
  g206Penalty: t.boolean,
  majorFoulCount: t.number,
  minorFoulCount: t.number,

  hubScore: hubScoreCodec,

  rp: t.number,
  energizedAchieved: t.boolean,
  superchargedAchieved: t.boolean,
  traversalAchived: t.boolean,

  totalAutoPoints: t.number,
  totalTeleopPoints: t.number,
  totalTowerPoints: t.number,
  totalPoints: t.number,
});
