// בס"ד
import type { GamePhase, TeamData } from "@repo/scouting_types";
import { useEffect, useMemo, useState, type FC } from "react";
import { FRC_TEAM_NUMBERS } from "@repo/frc";
import { firstElement } from "@repo/array-functions";
import { TeamSelect } from "./TeamSelect";
import { MovementChart } from "./MovementChart";

interface TeamTabProps {
  phase: GamePhase;
}

async function fetchTeamData(team: number) {
  const response = await fetch(`/api/v1/team?teams=${team}`);
  const data: {
    teams: Record<number, TeamData>;
  } = await response.json();
  return firstElement(Object.values(data.teams));
}

export const TeamTab: FC<TeamTabProps> = ({ phase }) => {
  const [teamData, setTeamData] = useState<TeamData>();
  const [teamNumber, setTeamNumber] = useState<number>();
  const data = useMemo(() => teamData?.[phase], [teamData, phase]);

  useEffect(() => {
    if (!teamNumber || !FRC_TEAM_NUMBERS.includes(teamNumber)) {
      return;
    }
    fetchTeamData(teamNumber).then(setTeamData).catch(alert);
  }, [teamNumber]);

  return (
    <div className="text-black">
      <TeamSelect teamNumber={teamNumber} setTeamNumber={setTeamNumber} />
      {data && "movement" in data && (
        <MovementChart movements={data.movement} />
      )}
    </div>
  );
};
