// בס"ד
import type { GamePhase, TeamData } from "@repo/scouting_types";
import { useEffect, useMemo, useState, type FC } from "react";

interface TeamTabProps {
  phase: GamePhase;
}

async function fetchTeamData(team: number) {
  const response = await fetch(`/api/v1/team?teams=${team}`);
  const data: TeamData = await response.json();
  return data;
}

export const TeamTab: FC<TeamTabProps> = ({ phase }) => {
  const [teamData, setTeamData] = useState<TeamData>();
  const [teamNumber, setTeamNumber] = useState<number>();
  const data = useMemo(() => teamData?.[phase], [teamData, phase]);

  useEffect(() => {
    if (!teamNumber) {
      return;
    }
    fetchTeamData(teamNumber).then(setTeamData).catch(alert);
  }, [teamNumber]);
  
  return <div>TeamTab</div>;
};
