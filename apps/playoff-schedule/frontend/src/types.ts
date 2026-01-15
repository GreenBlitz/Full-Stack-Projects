// בס"ד

export interface Alliance {
  score: number;
  team_keys: string[];
  surrogate_team_keys?: string[];
  dq_team_keys?: string[];
}

export interface Alliances {
  blue: Alliance;
  red: Alliance;
}

export interface MatchesSimpleType {
  key: string;
  comp_level: string;
  set_number: number;
  match_number: number;
  alliances: Alliances;
  winning_alliance: string;
  event_key: string;
  time?: number;
  predicted_time?: number;
  actual_time?: number;
}

export interface TeamsInEventType {
  key: string;
  team_number: number;
  nickname: string;
  name: string;
  city: string;
  state_prov: string;
  country: string;
}

interface Record {
  wins: number;
  losses: number;
  ties: number;
}
export interface RankItem {
  rank: number;
  team_key: string;
  record: Record;
}

export interface RankingsResponse {
  rankings: RankItem[];
}
