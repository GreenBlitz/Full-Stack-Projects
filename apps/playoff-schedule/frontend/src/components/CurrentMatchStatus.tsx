// בס"ד
import type React from "react";
import type { MatchesSimpleType } from "../endpoints/MatchSimple";
import { getMatchDisplayName } from "../utils/matchDisplayUtils";
import { noGap } from "../config/frcConfig";

interface CurrentMatchStatusProps {
  currentMatch: MatchesSimpleType | undefined;
  isFutureEvent: boolean;
  allMatchesCount: number;
}

export const CurrentMatchStatus: React.FC<CurrentMatchStatusProps> = ({
  currentMatch,
  isFutureEvent,
  allMatchesCount,
}) => {
  return (
    <div
      className={`mb-8 rounded-xl border-l-[6px] bg-white dark:bg-gray-800 p-5 shadow-sm ${
        isFutureEvent ? "border-blue-500 dark:border-blue-400" : "border-amber-500 dark:border-amber-400"
      }`}
    >
      <h2
        className={`mb-1 text-sm font-bold uppercase tracking-wider ${
          isFutureEvent ? "text-blue-500 dark:text-blue-400" : "text-amber-500 dark:text-amber-400"
        }`}
      >
        {isFutureEvent ? "Upcoming Event" : "Current Field Status"}
      </h2>
      {currentMatch !== undefined ? (
        <div className="flex items-center justify-between">
          <span className="text-3xl font-extrabold text-gray-800 dark:text-gray-200">
            {getMatchDisplayName(currentMatch)}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isFutureEvent
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400"
                : "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
            }`}
          >
            {isFutureEvent ? "SCHEDULED" : "IN PROGRESS"}
          </span>
        </div>
      ) : (
        <p className="italic text-gray-400 dark:text-gray-500">
          {allMatchesCount > noGap ? "Event Concluded" : "No matches scheduled"}
        </p>
      )}
    </div>
  );
};
