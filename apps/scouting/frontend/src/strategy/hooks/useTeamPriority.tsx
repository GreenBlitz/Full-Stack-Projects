import { useEffect, useState } from "react";
import { fetchATeamPriority } from "../components/priority/EditPriority";

export interface TeamPriority {
  teamNumber: number;
  priority: number;
}

export const useTeamPriority = (teamNumber: number) => {
  const [teamPriority, setTeamPriority] = useState<TeamPriority | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    if (!Number.isFinite(teamNumber)) {
      setTeamPriority(null);
      return;
    }

    const loadPriority = async () => {
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

  return {
    teamPriority,
    isLoading,
    feedbackMessage,
  };
};