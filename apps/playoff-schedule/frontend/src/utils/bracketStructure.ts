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
import type { AllianceColorOptional } from "./bracketTypes";

const feedingMatchesConfig: Record<
  number,
  {
    winFrom?: number[];
    lossFrom?: number[];
  }
> = {
  [match7]: { winFrom: [match1, match2] },
  [match8]: { winFrom: [match3, match4] },
  [match5]: { lossFrom: [match1, match2] },
  [match6]: { lossFrom: [match3, match4] },
  [match9]: { winFrom: [match6], lossFrom: [match7] },
  [match10]: { winFrom: [match5], lossFrom: [match8] },
  [match11]: { winFrom: [match7, match8] },
  [match12]: { winFrom: [match9, match10] },
  [match13]: { winFrom: [match12], lossFrom: [match11] },
};

export function getFeedingMatches(targetMatchNumber: number): {
  winFrom?: number[];
  lossFrom?: number[];
} {
  return feedingMatchesConfig[targetMatchNumber] ?? {};
}

export function getTeamsFromFeedingMatch(
  feedingMatchNumber: number,
  allMatches: MatchesSimpleType[],
  isWin: boolean
): { teams: string[]; alliance: AllianceColorOptional } {
  const feedingMatch = findMatchByBracketNumber(feedingMatchNumber, allMatches);

  if (!feedingMatch?.winning_alliance) {
    return { teams: [], alliance: null };
  }

  if (isWin) {
    const alliance = feedingMatch.winning_alliance === "red" ? "red" : "blue";
    return {
      teams:
        alliance === "red"
          ? feedingMatch.alliances.red.team_keys
          : feedingMatch.alliances.blue.team_keys,
      alliance,
    };
  }
  const alliance = feedingMatch.winning_alliance === "red" ? "blue" : "red";
  return {
    teams:
      alliance === "red"
        ? feedingMatch.alliances.red.team_keys
        : feedingMatch.alliances.blue.team_keys,
    alliance,
  };
}
