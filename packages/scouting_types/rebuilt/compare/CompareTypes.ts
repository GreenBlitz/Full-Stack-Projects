//בס"ד

import type { TeleClimbLevel } from "../scouting_form/Shift";

export interface TimesClimedToLevels {
  L1: number;
  L2: number;
  L3: number;
}

export interface CompareClimb {
  maxClimbLevel: TeleClimbLevel;
  timesClimbedToMax: number;
  timesClimbedInAuto: number;
  timesClimbedToLevels: TimesClimedToLevels;
}

export interface CompareAverageFuel {
  averageFuelInGame: number;
  averageFuelInAuto: number;
}

export interface TeamCompareData {
  teamNumber: number;
  averageFuel: CompareAverageFuel;
  climb: CompareClimb;
}

export interface CompareData {
  teamOne: TeamCompareData;
  teamTwo: TeamCompareData;
}
