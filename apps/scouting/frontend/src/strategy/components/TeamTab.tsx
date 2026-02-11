// בס"ד
import type {
  FuelEvents,
  FuelObject,
  GamePhase,
  MatchedEntry,
  TeamData,
} from "@repo/scouting_types";
import { useEffect, useMemo, useState, type FC } from "react";
import { FRC_TEAM_NUMBERS } from "@repo/frc";
import { firstElement } from "@repo/array-functions";
import { TeamSelect } from "./TeamSelect";
import { MovementChart } from "./MovementChart";
import { AccuracyChart } from "./AccuracyChart";
import { LineChart } from "../LineChart";
import { PhaseToggle } from "./PhaseToggle";
import { MetricsChart } from "./MetricsChart";
import { BarChart } from "../BarChart";
import { calculateMedianClimbs, getClimbDataset } from "../ClimbProcessing";

const METER_CENTIMETERS = 100;
const TWO_METER_CENTIMETERS = 200;
const MORE_DISTANCE = 2000;

const NO_DATA_ON_TEAM_STATUS = 502;
async function fetchTeamData(team: number) {
  const response = await fetch(`/api/v1/team?teams=${team}`);

  if (response.status === NO_DATA_ON_TEAM_STATUS) {
    alert(`No Data on ${team}`);
    return undefined;
  }

  const data: {
    teams: Record<number, TeamData>;
  } = await response.json();
  return firstElement(Object.values(data.teams));
}

const NO_FUEL_SHOT = 0;
const calculateAccuracy = (fuel: FuelObject) =>
  fuel.shot > NO_FUEL_SHOT ? fuel.scored / fuel.shot : NO_FUEL_SHOT;

const FIRST_MATCH_TYPE_CHARACTER = 0;

const createShotDataset = (data: MatchedEntry<FuelObject>[], key: FuelEvents) =>
  Object.fromEntries(
    data.map((entry) => [
      entry.match.type[FIRST_MATCH_TYPE_CHARACTER] + entry.match.number,
      { value: entry[key] },
    ]),
  );

const graphSection =
  "w-96 h-64 p-4 items-center bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl";
export const TeamTab: FC = () => {
  const [phase, setPhase] = useState<GamePhase>("tele");
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
    <div className="flex flex-col text-black items-center bg-slate-950">
      <div className="bg-rose-500" />
      <div className="bg-yellow-500" />
      <div className="bg-emerald-500" />
      <TeamSelect teamNumber={teamNumber} setTeamNumber={setTeamNumber} />
      <PhaseToggle activeMode={phase} setActiveMode={setPhase} />

      {data && (
        <AccuracyChart
          metrics={{
            meter: calculateAccuracy(data.accuracy[METER_CENTIMETERS]),
            twoMeter: calculateAccuracy(data.accuracy[TWO_METER_CENTIMETERS]),
            more: calculateAccuracy(data.accuracy[MORE_DISTANCE]),
          }}
        />
      )}
      {data && (
        <div className={graphSection}>
          <LineChart
            dataSetsProps={[
              {
                name: "Scored",
                points: createShotDataset(data.fuel, "scored"),
              },
              {
                name: "Missed",
                points: createShotDataset(data.fuel, "missed"),
              },
              {
                name: "Shot",
                points: createShotDataset(data.fuel, "shot"),
              },
              {
                name: "Pass",
                points: createShotDataset(data.fuel, "pass"),
              },
            ]}
          />
        </div>
      )}
      {data && "climbs" in data && (
        <div className={graphSection}>
          <LineChart
            min={0}
            dataSetsProps={[
              {
                name: "Climb",
                points: getClimbDataset(data),
                size: 10,
                color: "#10b981",
              },
            ]}
          />
        </div>
      )}
      {data && "climbs" in data && (
        <div className={graphSection}>
          <BarChart
            dataSetsProps={[
              {
                name: "Median Climb",
                points: calculateMedianClimbs(data, phase),
                color: "green",
              },
            ]}
          />
        </div>
      )}
      {data && "movement" in data && (
        <MovementChart movements={data.movement} />
      )}
      {teamData && phase === "fullGame" && (
        <MetricsChart {...teamData.metrics} />
      )}
    </div>
  );
};
