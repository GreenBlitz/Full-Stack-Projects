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

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-green-700 bg-black/40 p-2 w-40">
      <label className="text-xs font-medium text-green-100">
        Priority
      </label>

      <div className="rounded-md border border-green-700 bg-gray-900 px-2 py-1 text-xs text-green-100 min-h-[30px] flex items-center">
        {isLoading
          ? "Loading..."
          : teamPriority
            ? teamPriority.priority
            : "--"}
      </div>

      {feedbackMessage && (
        <p className="text-[10px] text-green-200">{feedbackMessage}</p>
      )}
    </div>
  );
};