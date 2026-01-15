// בס"ד
import type React from "react";
import type { MatchesSimpleType } from "../endpoints/MatchSimple";
import type { AllianceSimpleType } from "../endpoints/AlliancesSimple";
import { getMatchDisplayName } from "../utils/matchDisplayUtils";
import { formatMatchTime } from "../utils/matchDisplayUtils";
import { Alliance } from "./Alliance";
import { PotentialMatches } from "./PotentialMatches";
import { getPotentialNextMatches } from "../utils/bracketUtils";
import {
  targetTeamKey,
  timeMultiplier,
  nextMatchLimit,
  noGap,
  notFoundIndex,
} from "../config/frcConfig";

interface MatchCardProps {
  match: MatchesSimpleType;
  teamNameMap: Record<string, string>;
  futureMatches: MatchesSimpleType[];
  allMatches: MatchesSimpleType[];
  alliances: AllianceSimpleType[];
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  teamNameMap,
  futureMatches,
  allMatches,
  alliances,
}) => {
  const effectiveTime = match.predicted_time ?? match.time ?? undefined;
  const predictedDate = formatMatchTime(effectiveTime, timeMultiplier);

  const matchIndex = futureMatches.findIndex((match2) => match2.key === match.key);
  const matchesAway = matchIndex > notFoundIndex ? matchIndex : noGap;

  const isRedAlliance = match.alliances.red.team_keys.includes(targetTeamKey);
  const compLevel = match.comp_level;
  const isPlayoffMatch = compLevel === "sf" || compLevel === "f";
  const nextMatches = isPlayoffMatch
    ? getPotentialNextMatches(match, isRedAlliance, allMatches)
    : { ifWin: null, ifLoss: null };

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
              matchesAway <= nextMatchLimit
                ? "text-red-700 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400"
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

      {isPlayoffMatch && (nextMatches.ifWin ?? nextMatches.ifLoss) && (
        <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
          <PotentialMatches
            nextMatches={nextMatches}
            teamNameMap={teamNameMap}
            isRedAlliance={isRedAlliance}
            alliances={alliances}
          />
        </div>
      )}
    </div>
  );
};
