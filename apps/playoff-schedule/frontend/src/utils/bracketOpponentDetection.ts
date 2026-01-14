// בס"ד
import type { OpponentInfoOptions, OpponentInfo } from "./bracketTypes";
import { emptyArrayLength } from "./bracketConstants";
import { getFeedingBracketOpponent } from "./bracketFeedingHelpers";
import {
  checkDirectlyScheduledOpponent,
  predictNextOpponentFromPotential,
  type AllianceInfo,
} from "./bracketPredictionHelpers";

export const getOpponentInfo = (
  options: OpponentInfoOptions
): OpponentInfo | null => {
  const { currentMatch, nextMatch, isRedAlliance } = options;

  if (!nextMatch) {
    return null;
  }

  const currentTeamKeys = isRedAlliance
    ? currentMatch.alliances.red.team_keys
    : currentMatch.alliances.blue.team_keys;

  const nextMatchAlliances: AllianceInfo[] = [
    {
      alliance: "red",
      teams: nextMatch.alliances.red.team_keys,
      opponent: "blue",
    },
    {
      alliance: "blue",
      teams: nextMatch.alliances.blue.team_keys,
      opponent: "red",
    },
  ];

  const directOpponent = checkDirectlyScheduledOpponent(
    nextMatchAlliances,
    currentTeamKeys
  );
  if (directOpponent) return directOpponent;

  const feedingOpponent = getFeedingBracketOpponent(options, currentTeamKeys);
  if (feedingOpponent) return feedingOpponent;

  return predictNextOpponentFromPotential(
    nextMatchAlliances,
    currentTeamKeys,
    isRedAlliance
  );
};

export function formatOpponentLabel(opponentTeams: string[]): string {
  if (opponentTeams.length === emptyArrayLength) {
    return "TBD";
  }
  return opponentTeams.map((key) => key.replace("frc", "")).join(", ");
}
