import React, { useEffect, useState } from "react";
import { EditPriority, fetchATeamPriority, type TeamPriority } from "./EditPriority";

interface PriorityCardProps {
  teamNumber: number;
}

export const PriorityCard: React.FC<PriorityCardProps> = ({ teamNumber }) => {
  const [teamPriority, setTeamPriority] = useState<TeamPriority>();
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadPriority = async () => {
      setIsLoading(true);
      setFeedbackMessage("");

      try {
        const data = await fetchATeamPriority(teamNumber);
        setTeamPriority(data);
      } catch (error) {
        console.error(error);
        setFeedbackMessage("Error loading priority.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadPriority();
  }, [teamNumber]);

  if (isEditing) {
    return (
      <EditPriority
        teamNumber={teamNumber}
        initialPriority={teamPriority?.priority ?? null}
        onSaved={(savedPriority) => {
          setTeamPriority(savedPriority);
          setFeedbackMessage("");
          setIsEditing(false);
        }}
        onCancel={() => {
          setIsEditing(false);
        }}
      />
    );
  }

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

      <button
        type="button"
        onClick={() => setIsEditing(true)}
        disabled={!Number.isFinite(teamNumber)}
        className="
          w-full min-h-[44px]
          rounded-2xl
          px-4 py-2
          text-sm font-black tracking-wide text-white
          transition
          bg-sky-600/90 hover:bg-sky-500 active:bg-sky-700 shadow-lg
          disabled:cursor-not-allowed disabled:bg-slate-700/70 disabled:border disabled:border-white/10
        "
      >
        Edit
      </button>

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