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
            return [
              {
                teams: filtered,
                alliance,
                feedingMatchNumber: feedMatchNum,
                isWinSource,
              },
            ];
          }
          return [];
        }

        return (["red", "blue"] as const)
          .map((color) => {
            const teams = feedingMatch.alliances[color].team_keys.filter(
              (team) => !currentTeamKeys.includes(team)
            );
            return {
              teams,
              alliance: color,
              feedingMatchNumber: feedMatchNum,
              isWinSource,
            };
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
      feedingMatchNumber: opponent.feedingMatchNumber,
      sourceType: opponent.isWinSource ? "winner" : "loser",
    };
  }
  if (possibleOpponents.length > firstMatchNumber) {
    const allTeams = possibleOpponents.flatMap((p) => p.teams);
    // If we have mixed sources or multiple sources, we might not want to show specific "Winner of X".
    // But usually in double elim it's one path or another.
    // Ideally we pick the first one's info if consistent?
    // For now, let's just stick to the basic return if multiple.
    // Or if they come from the FIRST one which is usually the valid path?
    // Let's grab the info from the first one as a best guess for the label if needed,
    // or just return plain if it's too complex.
    // However, the issue described is about "If Win" and "If Loss" being the same.
    // Usually that's when we have 1 possible opponent set from a feeding match.
    // If we have > 1, it might be a weird edge case.

    // Let's try to pass the first one's info if available.
    const firstOpponent = possibleOpponents[firstArrayIndex];

    return {
      opponentAlliance: isRedAlliance ? "blue" : "red",
      opponentTeams: allTeams,
      ourAlliance: null,
      feedingMatchNumber: firstOpponent.feedingMatchNumber,
      sourceType: firstOpponent.isWinSource ? "winner" : "loser",
    };
  }
  return null;
};
