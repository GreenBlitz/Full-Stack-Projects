//בס"ד

import { TeamSuperScoutNumbers } from "../super_scout";

export interface PicklistStats {
  teleop: PicklistGameStats;
  auto: PicklistGameStats;
  superScouting: TeamSuperScoutNumbers;
}

export interface PicklistGameStats {
  climb: number;
}
