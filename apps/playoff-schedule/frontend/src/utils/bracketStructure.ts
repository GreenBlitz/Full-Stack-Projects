// בס"ד
import type { MatchesSimpleType } from "../endpoints/MatchSimple";
import { findMatchByBracketNumber } from "./bracketMatchFinder";
import { matchNumbers } from "./bracketConstants";
import type { AllianceColorOptional } from "./bracketTypes";

const feedingMatchesConfig: Record<
  number,
  {
    winFrom?: number[];
    lossFrom?: number[];
  }
> = {
  [matchNumbers.match7]: {
    winFrom: [matchNumbers.match1, matchNumbers.match2],
  },
  [matchNumbers.match8]: {
    winFrom: [matchNumbers.match3, matchNumbers.match4],
  },
  [matchNumbers.match5]: {
    lossFrom: [matchNumbers.match1, matchNumbers.match2],
  },
  [matchNumbers.match6]: {
    lossFrom: [matchNumbers.match3, matchNumbers.match4],
  },
  [matchNumbers.match9]: {
    winFrom: [matchNumbers.match6],
    lossFrom: [matchNumbers.match7],
  },
  [matchNumbers.match10]: {
    winFrom: [matchNumbers.match5],
    lossFrom: [matchNumbers.match8],
  },
  [matchNumbers.match11]: {
    winFrom: [matchNumbers.match7, matchNumbers.match8],
  },
  [matchNumbers.match12]: {
    winFrom: [matchNumbers.match9, matchNumbers.match10],
  },
  [matchNumbers.match13]: {
    winFrom: [matchNumbers.match12],
    lossFrom: [matchNumbers.match11],
  },
};

export function getFeedingMatches(targetMatchNumber: number): {
  winFrom?: number[];
  lossFrom?: number[];
} {
  return feedingMatchesConfig[targetMatchNumber] ?? {};
}

export const getTeamsFromFeedingMatch = (
  feedingMatchNumber: number,
  allMatches: MatchesSimpleType[],
  isWin: boolean
): { teams: string[]; alliance: AllianceColorOptional } => {
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
};
