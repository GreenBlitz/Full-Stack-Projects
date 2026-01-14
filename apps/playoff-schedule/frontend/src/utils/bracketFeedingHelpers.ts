// בס"ד
import type { OpponentInfoOptions, OpponentInfo } from "./bracketTypes";
import {
  getFeedingMatches,
  getTeamsFromFeedingMatch,
} from "./bracketStructure";
import { findMatchByBracketNumber } from "./bracketMatchFinder";
import {
  finalsBracketNumber,
  emptyArrayLength,
  firstMatchNumber,
  firstArrayIndex,
} from "./bracketConstants";

const gatherPossibleOpponentsFromFeedingMatches = (
  options: OpponentInfoOptions,
  currentTeamKeys: string[]
) => {
  const { nextBracketNumber, currentBracketNumber, allMatches } = options;
  const feedingMatches = getFeedingMatches(nextBracketNumber);

  return [
    { matches: feedingMatches.winFrom, isWinSource: true },
    { matches: feedingMatches.lossFrom, isWinSource: false },
  ].flatMap(({ matches, isWinSource }) => {
    if (!matches) {
      return [];
    }
    return matches
      .filter((feedMatchNum) => feedMatchNum !== currentBracketNumber)
      .flatMap((feedMatchNum) => {
        const feedingMatch = findMatchByBracketNumber(feedMatchNum, allMatches);
        if (!feedingMatch) {
          return [];
        }

        if (feedingMatch.winning_alliance) {
          const { teams, alliance } = getTeamsFromFeedingMatch(
            feedMatchNum,
            allMatches,
            isWinSource
          );
          if (teams.length <= emptyArrayLength || !alliance) {
            return [];
          }
          const filtered = teams.filter(
            (team) => !currentTeamKeys.includes(team)
          );
          if (filtered.length > emptyArrayLength) {
            return [{ teams: filtered, alliance }];
          }
          return [];
        }

        return (["red", "blue"] as const)
          .map((color) => {
            const teams = feedingMatch.alliances[color].team_keys.filter(
              (team) => !currentTeamKeys.includes(team)
            );
            return { teams, alliance: color };
          })
          .filter((item) => item.teams.length > emptyArrayLength);
      });
  });
};

export const getFeedingBracketOpponent = (
  options: OpponentInfoOptions,
  currentTeamKeys: string[]
): OpponentInfo | null => {
  const { nextBracketNumber, isRedAlliance } = options;

  if (nextBracketNumber <= finalsBracketNumber) {
    return null;
  }

  const possibleOpponents = gatherPossibleOpponentsFromFeedingMatches(
    options,
    currentTeamKeys
  );

  if (possibleOpponents.length === firstMatchNumber) {
    const opponent = possibleOpponents[firstArrayIndex];
    return {
      opponentAlliance: opponent.alliance,
      opponentTeams: opponent.teams,
      ourAlliance: opponent.alliance === "red" ? "blue" : "red",
    };
  }
  if (possibleOpponents.length > firstMatchNumber) {
    const allTeams = possibleOpponents.flatMap((p) => p.teams);
    return {
      opponentAlliance: isRedAlliance ? "blue" : "red",
      opponentTeams: allTeams,
      ourAlliance: null,
    };
  }
  return null;
};
