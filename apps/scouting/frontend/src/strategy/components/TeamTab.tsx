// בס"ד
import type {
  AutoClimb,
  Climb,
  FuelEvents,
  FuelObject,
  GamePhase,
  Interval,
  MatchedEntry,
  TeamData,
  TeleClimb,
} from "@repo/scouting_types";
import { useEffect, useMemo, useState, type FC } from "react";
import { FRC_TEAM_NUMBERS } from "@repo/frc";
import { calculateMedian, firstElement, isEmpty } from "@repo/array-functions";
import { TeamSelect } from "./TeamSelect";
import { MovementChart } from "./MovementChart";
import { AccuracyChart } from "./AccuracyChart";
import { LineChart } from "../LineChart";
import { PhaseToggle } from "./PhaseToggle";
import { MetricsChart } from "./MetricsChart";
import { BarChart } from "../BarChart";

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

const FIRST_MATCH_TYPE_CHARACTER = 0;
const CLIMB_LEVEL_LEVEL_CHARACTER = 1;

const createShotDataset = (data: MatchedEntry<FuelObject>[], key: FuelEvents) =>
  Object.fromEntries(
    data.map((entry) => [
      entry.match.type[FIRST_MATCH_TYPE_CHARACTER] + entry.match.number,
      { value: entry[key] },
    ]),
  );

const MILLISECONDS_TO_SECONDS = 1000;
const calculateMedianClimbTimes = (times: (Interval | null)[]): number => {
  const relevantTimes = times.filter((time) => time !== null);

  const climbDurations = relevantTimes.map(({ start, end }) => end - start);
  const climbDurationsSeconds = climbDurations.map(
    (time) => time / MILLISECONDS_TO_SECONDS,
  );

  if (isEmpty(climbDurationsSeconds)) {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return 0;
  }

  return calculateMedian(climbDurationsSeconds, (time) => time);
};

const mapToTotalInterval = (
  climbTime: TeleClimb["climbTime"],
  level: keyof TeleClimb["climbTime"],
) => {
  if (level === "L1") {
    return climbTime.L1;
  }
  if (!climbTime.L1 || !climbTime.L2) {
    return null;
  }
  const level2 = {
    start: climbTime.L1.start + climbTime.L2.start,
    end: climbTime.L1.end + climbTime.L2.end,
  };
  if (level === "L2") {
    return level2;
  }
  if (!climbTime.L3) {
    return null;
  }
  return {
    start: level2.start + climbTime.L3.start,
    end: level2.end + climbTime.L3.end,
  };
};

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
                points: Object.fromEntries(
                  data.climbs.map((climb) => [
                    climb.match.type[FIRST_MATCH_TYPE_CHARACTER] +
                      climb.match.number,
                    {
                      value: Number(climb.level[CLIMB_LEVEL_LEVEL_CHARACTER]),
                      pointStyle: climb.climbSide.middle
                        ? "dash"
                        : climb.climbSide.side
                          ? "star"
                          : climb.climbSide.support
                            ? "triangle"
                            : "dash",
                    },
                  ]),
                ),
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
                points: {
                  L1: calculateMedianClimbTimes(
                    data.climbs.map((climb) => climb.climbTime.L1),
                  ),
                  L2: calculateMedianClimbTimes(
                    data.climbs.map((climb) =>
                      "L2" in climb.climbTime
                        ? mapToTotalInterval(climb.climbTime, "L2")
                        : null,
                    ),
                  ),
                  L3: calculateMedianClimbTimes(
                    data.climbs.map((climb) =>
                      "L3" in climb.climbTime
                        ? mapToTotalInterval(climb.climbTime, "L3")
                        : null,
                    ),
                  ),
                },
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
