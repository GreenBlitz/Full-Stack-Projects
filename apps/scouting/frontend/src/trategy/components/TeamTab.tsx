// בס"ד
import type { GamePhase, TeamData } from "@repo/scouting_types";
import { useEffect, useState, type FC } from "react";

interface TeamTabProps {
  phase: GamePhase;
}

async function fetchTeamData(team: number) {
  const response = await fetch(`/api/v1/team?teams=${team}`);
  const data: TeamData = await response.json();
  return data;
}

export const TeamTab: FC<TeamTabProps> = ({ phase }) => {
  const [data, setData] = useState<TeamData>();
  const [teamNumber, setTeamNumber] = useState<number>();

  useEffect(() => {
    if (!teamNumber) {
      return;
    }
    fetchTeamData(teamNumber).then(setData).catch(alert);
  }, [teamNumber]);
  return <div>TeamTab</div>;
};
