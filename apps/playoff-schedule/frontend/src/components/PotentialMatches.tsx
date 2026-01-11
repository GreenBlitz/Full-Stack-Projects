// בס"ד
import type React from "react";
import type { NextMatches } from "../utils/bracketUtils";

interface PotentialMatchesProps {
  nextMatches: NextMatches;
}

export const PotentialMatches: React.FC<PotentialMatchesProps> = ({
  nextMatches,
}) => {
  if (!nextMatches.ifWin && !nextMatches.ifLoss) {
    return null;
  }

  return (
    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
      <div className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
        Predictive Path
      </div>
      <div className="space-y-2">
        {nextMatches.ifWin && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-green-700 dark:text-green-400 min-w-[60px]">
              If Win:
            </span>
            <span
              className={`${
                nextMatches.ifWin.isPlaceholder
                  ? "italic text-gray-500 dark:text-gray-400 border-b border-dashed border-gray-400 dark:border-gray-500"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {nextMatches.ifWin.matchLabel}
            </span>
          </div>
        )}
        {nextMatches.ifLoss && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-red-700 dark:text-red-400 min-w-[60px]">
              If Loss:
            </span>
            <span
              className={`${
                nextMatches.ifLoss.isPlaceholder
                  ? "italic text-gray-500 dark:text-gray-400 border-b border-dashed border-gray-400 dark:border-gray-500"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {nextMatches.ifLoss.matchLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
