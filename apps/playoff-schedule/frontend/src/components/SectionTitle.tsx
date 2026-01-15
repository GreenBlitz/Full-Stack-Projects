// בס"ד
import type React from "react";
import { targetTeamNumber } from "../config/frcConfig";

interface SectionTitleProps {
  isEventOver: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ isEventOver }) => {
  return (
    <h2 className="mb-5 border-b-2 border-gray-200 dark:border-gray-700 pb-2 text-2xl text-gray-800 dark:text-gray-200">
      {isEventOver
        ? `Final Results: Team ${targetTeamNumber}`
        : `Upcoming: Team ${targetTeamNumber}`}
    </h2>
  );
};
