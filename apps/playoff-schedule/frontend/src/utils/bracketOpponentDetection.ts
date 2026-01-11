// בס"ד
import type { MatchesSimpleType } from "../endpoints/MatchSimple";
import type { OpponentInfoOptions, OpponentInfo } from "./bracketTypes";
import { getFeedingMatches, getTeamsFromFeedingMatch } from "./bracketStructure";
import { findMatchByBracketNumber } from "./bracketMatchFinder";
import {
  finalsBracketNumber,
  emptyArrayLength,
  firstMatchNumber,
  firstArrayIndex,
} from "./bracketConstants";

export function getOpponentInfo(
  options: OpponentInfoOptions
): OpponentInfo | null {
  const {
    currentMatch,
    nextMatch,
    isRedAlliance,
    currentBracketNumber,
    nextBracketNumber,
    allMatches,
  } = options;

  if (!nextMatch) {
    return null;
  }

  const currentTeamKeys = isRedAlliance
    ? currentMatch.alliances.red.team_keys
    : currentMatch.alliances.blue.team_keys;

  const nextMatchRed = nextMatch.alliances.red.team_keys;
  const nextMatchBlue = nextMatch.alliances.blue.team_keys;

  const isRedInNext = currentTeamKeys.some((team) =>
    nextMatchRed.includes(team)
  );
  const isBlueInNext = currentTeamKeys.some((team) =>
    nextMatchBlue.includes(team)
  );

  if (isRedInNext) {
    return {
      opponentAlliance: "blue",
      opponentTeams: nextMatchBlue,
      ourAlliance: "red",
    };
  }

  if (isBlueInNext) {
    return {
      opponentAlliance: "red",
      opponentTeams: nextMatchRed,
      ourAlliance: "blue",
    };
  }

  if (nextBracketNumber > finalsBracketNumber) {
    const feedingMatches = getFeedingMatches(nextBracketNumber);
    const possibleOpponents: {
      teams: string[];
      alliance: "red" | "blue";
    }[] = [];

    if (feedingMatches.winFrom) {
      for (const feedMatchNum of feedingMatches.winFrom) {
        if (feedMatchNum !== currentBracketNumber) {
          const feedingMatch = findMatchByBracketNumber(
            feedMatchNum,
            allMatches
          );
          if (feedingMatch) {
            if (feedingMatch.winning_alliance) {
              const { teams, alliance } = getTeamsFromFeedingMatch(
                feedMatchNum,
                allMatches,
                true
              );
              if (teams.length > emptyArrayLength && alliance) {
                const filtered = teams.filter(
                  (team) => !currentTeamKeys.includes(team)
                );
                if (filtered.length > emptyArrayLength) {
                  possibleOpponents.push({ teams: filtered, alliance });
                }
              }
            } else {
              const redTeams = feedingMatch.alliances.red.team_keys.filter(
                (team) => !currentTeamKeys.includes(team)
              );
              const blueTeams = feedingMatch.alliances.blue.team_keys.filter(
                (team) => !currentTeamKeys.includes(team)
              );
              if (redTeams.length > emptyArrayLength) {
                possibleOpponents.push({ teams: redTeams, alliance: "red" });
              }
              if (blueTeams.length > emptyArrayLength) {
                possibleOpponents.push({ teams: blueTeams, alliance: "blue" });
              }
            }
          }
        }
      }
    }

    if (feedingMatches.lossFrom) {
      for (const feedMatchNum of feedingMatches.lossFrom) {
        if (feedMatchNum !== currentBracketNumber) {
          const feedingMatch = findMatchByBracketNumber(
            feedMatchNum,
            allMatches
          );
          if (feedingMatch) {
            if (feedingMatch.winning_alliance) {
              const { teams, alliance } = getTeamsFromFeedingMatch(
                feedMatchNum,
                allMatches,
                false
              );
              if (teams.length > emptyArrayLength && alliance) {
                const filtered = teams.filter(
                  (team) => !currentTeamKeys.includes(team)
                );
                if (filtered.length > emptyArrayLength) {
                  possibleOpponents.push({ teams: filtered, alliance });
                }
              }
            } else {
              const redTeams = feedingMatch.alliances.red.team_keys.filter(
                (team) => !currentTeamKeys.includes(team)
              );
              const blueTeams = feedingMatch.alliances.blue.team_keys.filter(
                (team) => !currentTeamKeys.includes(team)
              );
              if (redTeams.length > emptyArrayLength) {
                possibleOpponents.push({ teams: redTeams, alliance: "red" });
              }
              if (blueTeams.length > emptyArrayLength) {
                possibleOpponents.push({ teams: blueTeams, alliance: "blue" });
              }
            }
          }
        }
      }
    }

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
  }

  const hasRedTeams = nextMatchRed.length > emptyArrayLength;
  const hasBlueTeams = nextMatchBlue.length > emptyArrayLength;

  if (hasRedTeams && hasBlueTeams) {
    const redNotOurs = nextMatchRed.filter(
      (team) => !currentTeamKeys.includes(team)
    );
    const blueNotOurs = nextMatchBlue.filter(
      (team) => !currentTeamKeys.includes(team)
    );

    if (
      redNotOurs.length > emptyArrayLength &&
      blueNotOurs.length > emptyArrayLength
    ) {
      return {
        opponentAlliance: isRedAlliance ? "blue" : "red",
        opponentTeams: isRedAlliance ? blueNotOurs : redNotOurs,
        ourAlliance: null,
      };
    }
    if (redNotOurs.length > emptyArrayLength) {
      return {
        opponentAlliance: "red",
        opponentTeams: redNotOurs,
        ourAlliance: "blue",
      };
    }
    if (blueNotOurs.length > emptyArrayLength) {
      return {
        opponentAlliance: "blue",
        opponentTeams: blueNotOurs,
        ourAlliance: "red",
      };
    }
  }

  if (hasRedTeams) {
    const redNotOurs = nextMatchRed.filter(
      (team) => !currentTeamKeys.includes(team)
    );
    if (redNotOurs.length > emptyArrayLength) {
      return {
        opponentAlliance: "red",
        opponentTeams: redNotOurs,
        ourAlliance: "blue",
      };
    }
  }

  if (hasBlueTeams) {
    const blueNotOurs = nextMatchBlue.filter(
      (team) => !currentTeamKeys.includes(team)
    );
    if (blueNotOurs.length > emptyArrayLength) {
      return {
        opponentAlliance: "blue",
        opponentTeams: blueNotOurs,
        ourAlliance: "red",
      };
    }
  }

  return null;
}

export function formatOpponentLabel(opponentTeams: string[]): string {
  if (opponentTeams.length === emptyArrayLength) {
    return "TBD";
  }
  return opponentTeams.map((key) => key.replace("frc", "")).join(", ");
}
