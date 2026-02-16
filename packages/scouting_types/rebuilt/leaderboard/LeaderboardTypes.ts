//בס"ד

import type { Competition } from "../scouting_form";

export type ScoutedCompetitions = {
  competition: Competition;
  matchCount: number;
};

export interface Scouter {
  name: string;
  scoutedCompetitions: ScoutedCompetitions[];
}
