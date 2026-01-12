// בס"ד
import type React from "react";
import type { NextMatches } from "../utils/bracketUtils";
import { sliceStart } from "../config/frcConfig";
import {
  opponentTeamsLength,
  firstMatchIndex,
  nextMatchIndex,
} from "../utils/bracketConstants";

interface PotentialMatchesProps {
  nextMatches: NextMatches;
  teamNameMap: Record<string, string>;
  isRedAlliance: boolean;
}

export const PotentialMatches: React.FC<PotentialMatchesProps> = ({
  nextMatches,
  teamNameMap,
}) => {
  if (!nextMatches.ifWin && !nextMatches.ifLoss) {
    return null;
  }

  const renderMatchInfo = (match: NextMatches[keyof NextMatches]) => {
    if (!match) return null;

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
    const nextMatchNumberMatch = matchName.match(/Match (\d+)/);
    const nextMatchNumber = nextMatchNumberMatch
      ? `Match ${nextMatchNumberMatch[nextMatchIndex]}`
      : matchName.includes("Finals")
        ? "Finals"
        : null;
    return (
      <div className="space-y-3">
        {nextMatchNumber && (
          <div className="font-bold text-lg text-gray-800 dark:text-gray-200">
            {nextMatchNumber}
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

  return (
    <div className="mt-4 border-t-2 border-gray-300 dark:border-gray-600 pt-4">
      <div className="text-md font-bold uppercase text-gray-700 dark:text-gray-300 mb-4">
        <u>Predictions for the next Match</u>
      </div>
      <div className="space-y-4">
        {nextMatches.ifWin && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <span className="font-bold text-green-700 dark:text-green-400 min-w-[80px] text-base">
                If Win:
              </span>
              <div className="flex-1">
                <div className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  You are in:{" "}
                  <span
                    className={`font-bold ${
                      nextMatches.ifWin.ourAlliance === "red"
                        ? "text-red-700 dark:text-red-400"
                        : nextMatches.ifWin.ourAlliance === "blue"
                          ? "text-blue-700 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {nextMatches.ifWin.ourAlliance === "red"
                      ? "Red"
                      : nextMatches.ifWin.ourAlliance === "blue"
                        ? "Blue"
                        : "TBD"}{" "}
                    Alliance
                  </span>
                </div>
                {renderMatchInfo(nextMatches.ifWin)}
              </div>
            </div>
          </div>
        )}
        {nextMatches.ifLoss && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <span className="font-bold text-red-700 dark:text-red-400 min-w-[80px] text-base">
                If Loss:
              </span>
              <div className="flex-1">
                <div className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  You are in:{" "}
                  <span
                    className={`font-bold ${
                      nextMatches.ifLoss.ourAlliance === "red"
                        ? "text-red-700 dark:text-red-400"
                        : nextMatches.ifLoss.ourAlliance === "blue"
                          ? "text-blue-700 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {nextMatches.ifLoss.ourAlliance === "red"
                      ? "Red"
                      : nextMatches.ifLoss.ourAlliance === "blue"
                        ? "Blue"
                        : "TBD"}{" "}
                    Alliance
                  </span>
                </div>
                {renderMatchInfo(nextMatches.ifLoss)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
