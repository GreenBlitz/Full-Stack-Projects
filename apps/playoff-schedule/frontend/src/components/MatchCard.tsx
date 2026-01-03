// בס"ד
import type React from "react";
import type { MatchesSimpleType } from "../endpoints/MatchSimple";
import { getMatchDisplayName } from "../utils/matchDisplayUtils";
import { formatMatchTime } from "../utils/matchDisplayUtils";
import { Alliance } from "./Alliance";
import {
  targetTeamKey,
  timeMultiplier,
  nextMatchLimit,
  noGap,
  notFoundIndex,
} from "../config/frcConfig";

interface MatchCardProps {
  match: MatchesSimpleType;
  teamNameMap: Map<string, string>;
  futureMatches: MatchesSimpleType[];
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  teamNameMap,
  futureMatches,
}) => {
  const effectiveTime = match.predicted_time ?? match.time ?? undefined;
  const predictedDate = formatMatchTime(effectiveTime, timeMultiplier);

  const matchIndex = futureMatches.findIndex((m) => m.key === match.key);
  const matchesAway = matchIndex > notFoundIndex ? matchIndex : noGap;

  const isRedAlliance = match.alliances.red.team_keys.includes(targetTeamKey);

  return (
    <div className="mb-5 overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-5 py-4">
        <div>
          <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {getMatchDisplayName(match)}
          </span>
        </div>
        <div className="flex flex-col items-end text-right">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            {predictedDate}
          </div>
          <div
            className={`mt-1 text-sm font-bold ${
              matchesAway <= nextMatchLimit ? "text-red-700 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {matchesAway <= noGap ? "PLAYING NOW" : `IN ${matchesAway} MATCHES`}
          </div>
        </div>
      </div>

      <div className="flex">
        <Alliance
          teamKeys={match.alliances.red.team_keys}
          teamNameMap={teamNameMap}
          allianceColor="red"
          isTargetTeamInAlliance={isRedAlliance}
        />
        <Alliance
          teamKeys={match.alliances.blue.team_keys}
          teamNameMap={teamNameMap}
          allianceColor="blue"
          isTargetTeamInAlliance={!isRedAlliance}
        />
      </div>
    </div>
  );
};
