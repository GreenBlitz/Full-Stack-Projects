// בס"ד
import type { GamePhase, TeamData } from "@repo/scouting_types";
import { useEffect, useMemo, useState, type FC } from "react";
import { FRC_TEAM_NUMBERS, FRC_TEAMS } from "@repo/frc";
import { firstElement } from "@repo/array-functions";

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
      <input
        onChange={(event) => {
          setTeamNumber(Number(event.currentTarget.value));
        }}
        type="number"
        className="bg-white"
      />
      <select
        className="bg-slate-400"
        onChange={(event) => {
          setTeamNumber(
            Number(firstElement(event.currentTarget.value.split(":"))),
          );
        }}
      >
        {FRC_TEAMS.map((team) => (
          <option
            key={team.teamNumber}
          >{`${team.teamNumber}:${team.nickname}`}</option>
        ))}
      </select>
    </div>
  );
};
