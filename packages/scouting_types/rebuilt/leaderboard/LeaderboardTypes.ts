//בס"ד

export interface ScouterInfo {
  name: string;
  scoutedMatches: number;
}

export interface CompetitionLeaderboard {
  scouters: ScouterInfo[];
}
