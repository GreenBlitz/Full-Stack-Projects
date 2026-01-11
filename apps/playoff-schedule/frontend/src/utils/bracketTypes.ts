// בס"ד
import type { MatchesSimpleType } from "../endpoints/MatchSimple";

export interface PotentialMatch {
  matchLabel: string;
  matchKey?: string;
  match?: MatchesSimpleType;
  isPlaceholder: boolean;
  opponentAlliance?: "red" | "blue";
  opponentTeams?: string[];
  ourAlliance?: "red" | "blue" | null;
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
  opponentAlliance: "red" | "blue";
  opponentTeams: string[];
  ourAlliance: "red" | "blue" | null;
}
