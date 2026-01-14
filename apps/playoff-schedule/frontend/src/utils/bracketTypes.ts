// בס"ד
import type { MatchesSimpleType } from "../endpoints/MatchSimple";

export type AllianceColor = "red" | "blue";
export type AllianceColorOptional = "red" | "blue" | null;
export interface PotentialMatch {
  matchLabel: string;
  matchKey?: string;
  match?: MatchesSimpleType;
  isPlaceholder: boolean;
  opponentAllianceColor?: AllianceColorOptional;
  opponentTeams?: string[];
  ourAlliance?: AllianceColorOptional;
}

export interface NextMatches {
  ifWin: PotentialMatch | null;
  ifLoss: PotentialMatch | null;
}

export interface BracketMapping {
  ifWin: number | "finals" | "eliminated";
  ifLoss: number | "eliminated";
}

export interface OpponentInfoOptions {
  currentMatch: MatchesSimpleType;
  nextMatch: MatchesSimpleType | null;
  isRedAlliance: boolean;
  currentBracketNumber: number;
  nextBracketNumber: number;
  allMatches: MatchesSimpleType[];
}

export interface OpponentInfo {
  opponentAlliance: AllianceColor;
  opponentTeams: string[];
  ourAlliance: AllianceColorOptional;
  feedingMatchNumber?: number;
  sourceType?: "winner" | "loser";
}
