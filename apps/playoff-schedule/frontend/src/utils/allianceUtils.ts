// בס"ד
import type { PotentialMatch } from "./bracketTypes";
import type { AllianceSimpleType } from "../endpoints/AlliancesSimple";
import { alliancesLength, allianceNumberRegex, parseIntRadix, opponentTeamsLength } from "./bracketConstants";

const allianceNumberMatchIndex = 1;

export function getOpponentAllianceNumber(
  match: PotentialMatch,
  alliances: AllianceSimpleType[]
): number | null {
  if (!match.match || !match.opponentAllianceColor || !match.opponentTeams) {
    return null;
  }

  if (alliances.length === alliancesLength) {
    return null;
  }

  const opponentTeamKeys = match.opponentTeams;
  if (opponentTeamKeys.length === opponentTeamsLength) {
    return null;
  }

  const opponentAlliance = alliances.find((alliance) => {
    const allAllianceTeams = [
      ...alliance.picks,
      ...(alliance.backup?.in ? [alliance.backup.in] : []),
    ];

    return opponentTeamKeys.some((teamKey) =>
      allAllianceTeams.includes(teamKey)
    );
  });

  if (opponentAlliance) {
    const allianceNumberMatch =
      opponentAlliance.name.match(allianceNumberRegex);
    if (allianceNumberMatch) {
      return parseInt(
        allianceNumberMatch[allianceNumberMatchIndex],
        parseIntRadix
      );
    }
  }

  return null;
}
