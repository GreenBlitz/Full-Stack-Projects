//בס"ד

import { TeamSuperScoutNumbers } from "../super_scout";

export interface PicklistStats {
  tele: PicklistGameStats;
  auto: PicklistGameStats;
  superScouting: TeamSuperScoutNumbers;
}

export interface PicklistGameStats {
  climb: number;
}
