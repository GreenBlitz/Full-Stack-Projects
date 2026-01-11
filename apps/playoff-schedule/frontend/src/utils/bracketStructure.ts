// בס"ד
import type { MatchesSimpleType } from "../endpoints/MatchSimple";
import { findMatchByBracketNumber } from "./bracketMatchFinder";
import {
  match1,
  match2,
  match3,
  match4,
  match5,
  match6,
  match7,
  match8,
  match9,
  match10,
  match11,
  match12,
  match13,
} from "./bracketConstants";

export function getFeedingMatches(targetMatchNumber: number): {
  winFrom?: number[];
  lossFrom?: number[];
} {
  if (targetMatchNumber === match7) {
    return { winFrom: [match1, match2] };
  }
  if (targetMatchNumber === match8) {
    return { winFrom: [match3, match4] };
  }
  if (targetMatchNumber === match5) {
    return { lossFrom: [match1, match2] };
  }
  if (targetMatchNumber === match6) {
    return { lossFrom: [match3, match4] };
  }
  if (targetMatchNumber === match9) {
    return { winFrom: [match6], lossFrom: [match7] };
  }
  if (targetMatchNumber === match10) {
    return { winFrom: [match5], lossFrom: [match8] };
  }
  if (targetMatchNumber === match11) {
    return { winFrom: [match7, match8] };
  }
  if (targetMatchNumber === match12) {
    return { winFrom: [match9, match10] };
  }
  if (targetMatchNumber === match13) {
    return { winFrom: [match12], lossFrom: [match11] };
  }
  return {};
}

export function getTeamsFromFeedingMatch(
  feedingMatchNumber: number,
  allMatches: MatchesSimpleType[],
  isWin: boolean
): { teams: string[]; alliance: "red" | "blue" | null } {
  const feedingMatch = findMatchByBracketNumber(feedingMatchNumber, allMatches);
  if (!feedingMatch) {
    return { teams: [], alliance: null };
  }

  if (feedingMatch.winning_alliance) {
    if (isWin) {
      const alliance = feedingMatch.winning_alliance === "red" ? "red" : "blue";
      return {
        teams:
          alliance === "red"
            ? feedingMatch.alliances.red.team_keys
            : feedingMatch.alliances.blue.team_keys,
        alliance,
      };
    } else {
      const alliance = feedingMatch.winning_alliance === "red" ? "blue" : "red";
      return {
        teams:
          alliance === "red"
            ? feedingMatch.alliances.red.team_keys
            : feedingMatch.alliances.blue.team_keys,
        alliance,
      };
    }
  }

  return { teams: [], alliance: null };
}
