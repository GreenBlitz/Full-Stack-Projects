// בס"ד
import type React from "react";
import type { PotentialMatch } from "../utils/bracketTypes";
import type { AllianceSimpleType } from "../endpoints/AlliancesSimple";
import { sliceStart } from "../config/frcConfig";
import {
  opponentTeamsLength,
  firstMatchIndex,
  nextMatchIndex,
  matchNumberRegex,
} from "../utils/bracketConstants";
import { getOpponentAllianceNumber } from "../utils/allianceUtils";

interface MatchInfoProps {
  match: PotentialMatch;
  teamNameMap: Record<string, string>;
  alliances: AllianceSimpleType[];
}

export const MatchInfo: React.FC<MatchInfoProps> = ({
  match,
  teamNameMap,
  alliances,
}) => {
  if (match.isPlaceholder) {
    return (
      <span className="italic text-gray-500 dark:text-gray-400 border-b border-dashed border-gray-400 dark:border-gray-500">
        {match.matchLabel}
      </span>
    );
  }

  if (match.matchLabel.includes("Eliminated")) {
    return (
      <span className="text-red-700 dark:text-red-400 font-semibold text-base">
        {match.matchLabel}
      </span>
    );
  }

  const matchName = match.matchLabel.split(" vs ")[firstMatchIndex];
  const nextMatchNumberMatch = matchName.match(matchNumberRegex);
  const nextMatchNumber = nextMatchNumberMatch
    ? `Match ${nextMatchNumberMatch[nextMatchIndex]}`
    : matchName.includes("Finals")
      ? "Finals"
      : null;

  const opponentAllianceNumber = getOpponentAllianceNumber(match, alliances);

  return (
    <div className="space-y-3">
      {nextMatchNumber && (
        <div className="font-bold text-lg text-gray-800 dark:text-gray-200">
          {nextMatchNumber}
        </div>
      )}
      {opponentAllianceNumber && (
        <div className="text-m font-semibold text-gray-700 dark:text-gray-300">
          {`Opp alliance:`} {opponentAllianceNumber}
        </div>
      )}
      {match.opponentTeams &&
        match.opponentTeams.length > opponentTeamsLength && (
          <div className="pl-2 space-y-1.5">
            {match.opponentTeams.map((teamKey) => {
              const teamNumber = teamKey.slice(sliceStart);
              const teamName = teamNameMap[teamKey] ?? "Unknown";
              return (
                <div
                  key={teamKey}
                  className="flex items-center gap-3 text-base"
                >
                  <span className="w-14 font-bold text-gray-800 dark:text-gray-200">
                    {teamNumber}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {teamName}
                  </span>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
};
