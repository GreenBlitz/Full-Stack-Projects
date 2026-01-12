// בס"ד
import type { PotentialMatch } from "./bracketTypes";
import type { AllianceSimpleType } from "../endpoints/AlliancesSimple";
import { allianceNumberRegex, parseIntRadix } from "./bracketConstants";

export const getOpponentAllianceNumber = (
  match: PotentialMatch,
  alliances: AllianceSimpleType[]
): number | null => {
  if (!match.match || !match.opponentAllianceColor || !match.opponentTeams) {
    return null;
  }

  if (alliances.length === 0) {
    return null;
  }

  const opponentTeamKeys = match.opponentTeams;
  if (opponentTeamKeys.length === 0) {
    return null;
  }

  for (const alliance of alliances) {
    const allAllianceTeams = [
      ...alliance.picks,
      ...(alliance.backup?.in ? [alliance.backup.in] : []),
    ];

    const hasOpponentTeam = opponentTeamKeys.some((teamKey) =>
      allAllianceTeams.includes(teamKey)
    );

    if (hasOpponentTeam) {
      const allianceNumberMatch = alliance.name.match(allianceNumberRegex);
      if (allianceNumberMatch) {
        return parseInt(allianceNumberMatch[1], parseIntRadix);
      }
    }
  }

  return null;
};
