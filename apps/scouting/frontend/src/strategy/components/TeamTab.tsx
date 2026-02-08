// בס"ד
import type { FuelObject, GamePhase, TeamData } from "@repo/scouting_types";
import { useEffect, useMemo, useState, type FC } from "react";
import { FRC_TEAM_NUMBERS } from "@repo/frc";
import { firstElement } from "@repo/array-functions";
import { TeamSelect } from "./TeamSelect";
import { MovementChart } from "./MovementChart";
import { AccuracyChart } from "./AccuracyChart";

interface TeamTabProps {
  phase: GamePhase;
}

const METER_CENTIMETERS = 100;
const TWO_METER_CENTIMETERS = 200;
const MORE_DISTANCE = 2000;

async function fetchTeamData(team: number) {
  const response = await fetch(`/api/v1/team?teams=${team}`);
  const data: {
    teams: Record<number, TeamData>;
  } = await response.json();
  return firstElement(Object.values(data.teams));
}

const NO_FUEL_SHOT = 0;
const calculateAccuracy = (fuel: FuelObject) =>
  fuel.shot > NO_FUEL_SHOT ? fuel.scored / fuel.shot : NO_FUEL_SHOT;

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
      <div className="bg-rose-500" />
      <div className="bg-yellow-500" />
      <div className="bg-emerald-500" />
      <TeamSelect teamNumber={teamNumber} setTeamNumber={setTeamNumber} />
      {data && "movement" in data && (
        <MovementChart movements={data.movement} />
      )}
      {data && (
        <AccuracyChart
          metrics={{
            meter: calculateAccuracy(data.accuracy[METER_CENTIMETERS]),
            twoMeter: calculateAccuracy(data.accuracy[TWO_METER_CENTIMETERS]),
            more: calculateAccuracy(data.accuracy[MORE_DISTANCE]),
          }}
        />
      )}
    </div>
  );
};
