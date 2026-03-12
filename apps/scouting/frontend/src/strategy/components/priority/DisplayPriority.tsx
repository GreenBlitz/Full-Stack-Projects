import React, { useEffect, useState } from "react";
import { fetchATeamPriority, type TeamPriority } from "./EditPriority";

interface DisplayPriorityProps {
  teamNumber: number;
}

export const DisplayPriority: React.FC<DisplayPriorityProps> = ({
  teamNumber,
}) => {
  const [teamPriority, setTeamPriority] = useState<TeamPriority | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    const loadPriority = async () => {
      if (!Number.isFinite(teamNumber)) {
        setTeamPriority(null);
        return;
      }

      setIsLoading(true);
      setFeedbackMessage("");

      try {
        const data = await fetchATeamPriority(teamNumber);
        setTeamPriority(data);
      } catch (error) {
        console.error(error);
        setTeamPriority(null);
        setFeedbackMessage("Error loading priority.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadPriority();
  }, [teamNumber]);

  return (
    <div
      className="
        w-52 p-4
        flex flex-col gap-3
        items-center
        bg-slate-900/40 backdrop-blur-md
        border border-white/10
        rounded-3xl shadow-2xl
      "
    >
      <span className="text-xs font-black tracking-[0.2em] uppercase text-slate-400">
        Team Priority
      </span>

      <div
        className="
          w-full min-h-[72px]
          flex items-center justify-center
          rounded-2xl
          border border-white/10
          bg-slate-950/70
          text-3xl font-black text-white
          shadow-inner
        "
      >
        {isLoading
          ? "..."
          : teamPriority
            ? teamPriority.priority
            : "--"}
      </div>

      {feedbackMessage ? (
        <p className="text-xs text-red-300 text-center">{feedbackMessage}</p>
      ) : (
        <p className="text-[11px] text-slate-500 text-center">
          Current saved value
        </p>
      )}
    </div>
  );
};