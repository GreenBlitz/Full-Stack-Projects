//בס"ד

import { TeamSuperScout } from "../super_scout";

export interface PicklistStats {
  teleop: PicklistGameStats;
  auto: PicklistGameStats;
  superScouting: TeamSuperScout;
}

export interface PicklistGameStats {
  fuel: number;
  closeFuel: number;
  mediumFuel: number;
  farFuel: number;
  climb: number;
}
