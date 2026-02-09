//בס"ד

import type { TeleClimbLevel } from "../scouting_form/Shift";

export interface TimesClimedToLevels {
  L1: number;
  L2: number;
  L3: number;
}

export interface TeamCompareData {
  teamNumber: number;
  averageFuelInGame: number;
  averageFuelInAuto: number;
  maxClimbLevel: TeleClimbLevel;
  timesClimbedToMax: number;
  timesClimbedInAuto: number;
  timesClimbedToLevels: TimesClimedToLevels;
}

export interface CompareData {
  teamOne: TeamCompareData;
  teamTwo: TeamCompareData;
}
