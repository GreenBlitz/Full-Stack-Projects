// בס"ד
import type React from "react";
import { targetTeamNumber } from "../config/frcConfig";

interface EmptyStateProps {
  isTeamDone: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isTeamDone }) => {
  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-10 text-center text-gray-400 dark:text-gray-500">
      {isTeamDone ? (
        <p>
          Team {targetTeamNumber} has completed all scheduled matches for this
          event (or for today).
        </p>
      ) : (
        <p>No upcoming matches found for Team {targetTeamNumber}.</p>
      )}
    </div>
  );
};
