//בס"ד

import type { Competition } from "../scouting_form";

export type ScoutedCompetitions = {
  competition: Competition;
  matchCount: number;
};

export type ScoutedCompetitionsRecord = Record<Competition, number>;

export interface Scouter {
  name: string;
  scoutedCompetitions: ScoutedCompetitions[];
}

export type ScouterRecord = Record<string, ScoutedCompetitionsRecord>;
