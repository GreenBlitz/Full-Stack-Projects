//בס"ד

import type { GeneralFuelData } from "../fuel";
import type { ClimbLevel } from "../scouting_form";

export interface TinderStats {
  fuel: GeneralFuelData;
  climb: ClimbStats;
  movement: MovementStats;
}

export interface ClimbStats {
  maxClimbLevel: ClimbLevel;
}

export interface MovementStats {
  stuckOnBump: number;
}
