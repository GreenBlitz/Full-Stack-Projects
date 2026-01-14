// בס"ד
import type React from "react";
import type { RankItem } from "../types";

interface FinalResultsProps {
  teamRank: RankItem | null;
}

export const FinalResults: React.FC<FinalResultsProps> = ({ teamRank }) => {
  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-8 text-center shadow-md">
      {teamRank ? (
        <>
          <div className="mb-2 text-base uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Final Rank
          </div>
          <div className="text-6xl font-bold leading-none text-indigo-700 dark:text-indigo-400">
            #{teamRank.rank}
          </div>
          <div className="mt-5 inline-block rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-5 py-2 font-bold text-indigo-700 dark:text-indigo-400">
            Record: {teamRank.record.wins}-{teamRank.record.losses}-
            {teamRank.record.ties}
          </div>
        </>
      ) : (
        <p className="italic text-gray-500 dark:text-gray-400">
          Rank data not available for this event.
        </p>
      )}
    </div>
  );
};
