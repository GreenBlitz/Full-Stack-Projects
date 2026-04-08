//בס"ד

import { TeamSuperScoutNumbers } from "../super_scout";

export interface PicklistStats {
  teleop: PicklistGameStats;
  auto: PicklistGameStats;
  superScouting: TeamSuperScoutNumbers;
}

export interface PicklistGameStats {
  fuel: number;
  closeFuel: number;
  mediumFuel: number;
  farFuel: number;
  climb: number;
}
