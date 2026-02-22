//בס"ד

import type { Competition } from "../scouting_form";

export interface Scouter {
  name: string;
  scoutedMatches: number;
}

export interface CompetitionLeaderboard {
  competition: Competition;
  Scouters: Scouter[];
}
