// בס"ד
import * as t from "io-ts";

const yesNo = t.keyof({
  Yes: null,
  No: null,
});

const climb = t.keyof({
  Parked: null,
  DeepCage: null,
  ShallowCage: null,
  None: null,
});

// --- ReefRow Codec ---
const reefRow = t.type({
  nodeA: t.boolean,
  nodeB: t.boolean,
  nodeC: t.boolean,
  nodeD: t.boolean,
  nodeE: t.boolean,
});

// --- Reef Codec ---
const reef = t.type({
  botRow: reefRow,
  midRow: reefRow,
  tba_botRowCount: t.number,
  tba_midRowCount: t.number,
  tba_topRowCount: t.number,
  topRow: reefRow,
  trough: t.number,
});

// --- ScoreBreakdown2025 Codec ---
export const scoreBreakdown2025 = t.type({
  adjustPoints: t.number,
  algaePoints: t.number,
  autoBonusAchieved: t.boolean,
  autoCoralCount: t.number,
  autoCoralPoints: t.number,
  autoLineRobot1: yesNo,
  autoLineRobot2: yesNo,
  autoLineRobot3: yesNo,
  autoMobilityPoints: t.number,
  autoPoints: t.number,
  autoReef: reef,
  bargeBonusAchieved: t.boolean,
  coopertitionCriteriaMet: t.boolean,
  coralBonusAchieved: t.boolean,
  endGameBargePoints: t.number,
  endGameRobot1: climb,
  endGameRobot2: climb,
  endGameRobot3: climb,
  foulCount: t.number,
  foulPoints: t.number,
  g206Penalty: t.boolean,
  g410Penalty: t.boolean,
  g418Penalty: t.boolean,
  g428Penalty: t.boolean,
  netAlgaeCount: t.number,
  rp: t.number,
  techFoulCount: t.number,
  teleopCoralCount: t.number,
  teleopCoralPoints: t.number,
  teleopPoints: t.number,
  teleopReef: reef,
  totalPoints: t.number,
  wallAlgaeCount: t.number,
});

export type ScoreBreakdown2025 = t.TypeOf<typeof scoreBreakdown2025>;
