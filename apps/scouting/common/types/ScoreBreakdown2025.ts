// בס"ד

type YesNo = "Yes" | "No";

type Climb = "Park" | "DeepCage" | "ShallowCage" | "None";

interface ReefRow {
  nodeA: boolean;
  nodeB: boolean;
  nodeC: boolean;
  nodeD: boolean;
  nodeE: boolean;
}
interface Reef {
  botRow: ReefRow;
  midRow: ReefRow;
  tba_botRowCount: number;
  tba_midRowCount: number;
  tba_topRowCount: number;
  topRow: ReefRow;
  trough: number;
}
export interface ScoreBreakdown2025 {
  adjustPoints: number;
  algaePoints: number;
  autoBonusAchieved: boolean;
  autoCoralCount: number;
  autoCoralPoints: number;
  autoLineRobot1: YesNo;
  autoLineRobot2: YesNo;
  autoLineRobot3: YesNo;
  autoMobilityPoints: number;
  autoPoints: number;
  autoReef: Reef;
  bargeBonusAchieved: boolean;
  coopertitionCriteriaMet: boolean;
  coralBonusAchieved: boolean;
  endGameBargePoints: number;
  endGameRobot1: Climb;
  endGameRobot2: Climb;
  endGameRobot3: Climb;
  foulCount: number;
  foulPoints: number;
  g206Penalty: boolean;
  g410Penalty: boolean;
  g418Penalty: boolean;
  g428Penalty: boolean;
  netAlgaeCount: number;
  rp: number;
  techFoulCount: number;
  teleopCoralCount: number;
  teleopCoralPoints: number;
  teleopPoints: number;
  teleopReef: Reef;
  totalPoints: number;
  wallAlgaeCount: number;
}
