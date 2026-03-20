import React, { useEffect, useState } from "react";
import { fetchATeamPriority, type TeamPriority } from "./EditPriority";
import { useTeamPriority } from "../../hooks/useTeamPriority";

interface DisplayPriorityCellProps {
  teamNumber: number;
}

export const DisplayPriorityCell: React.FC<DisplayPriorityCellProps> = ({
  teamNumber,
}) => {
  const { teamPriority, isLoading } =
  useTeamPriority(teamNumber);

  return (
    <span
      className="
        inline-flex min-w-[3rem] items-center justify-center
        rounded-lg border border-emerald-500/20
        bg-slate-800/70 px-2.5 py-1
        text-xs font-black text-emerald-400
      "
    >
      {isLoading ? "..." : teamPriority ? teamPriority.priority : "--"}
    </span>
  );
};