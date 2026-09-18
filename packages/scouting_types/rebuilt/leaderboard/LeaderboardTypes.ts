//בס"ד

export interface Scouter {
  name: string;
  scoutedMatches: number;
}

export interface CompetitionLeaderboard {
  scouters: Scouter[];
}
