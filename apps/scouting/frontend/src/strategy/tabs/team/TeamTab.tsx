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
import { MovementChart } from "../../components/MovementChart";
import { AccuracyChart } from "../../components/AccuracyChart";
import { LineChart } from "../../components/LineChart";
import { PhaseToggle } from "../../components/PhaseToggle";
import { MetricsChart } from "../../components/MetricsChart";
import { BarChart } from "../../components/BarChart";
import { calculateMedianClimbs, getClimbDataset } from "../../ClimbProcessing";
import { useLocalStorage } from "@repo/local_storage_hook";
import { fetchTeamNumbers } from "../../fetches";

const METER_CENTIMETERS = 100;
const TWO_METER_CENTIMETERS = 200;
const MORE_DISTANCE = 2000;

const TEAM_DATA_URL = "/api/v1/team";
const NO_DATA_ON_TEAM_STATUS = 502;
async function fetchTeamData(team: number, recency?: number) {
  const recencyQuery = recency ? `&recency=${recency}` : "";
  const response = await fetch(`${TEAM_DATA_URL}?teams=${team}${recencyQuery}`);

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
  const [teamNumber, setTeamNumber] = useLocalStorage<number | null>(
    "team/teamNumber",
    null,
  );
  const [gameRecency, setGameRecency] = useLocalStorage<number | null>(
    "team/recency",
    null,
  );
  const [scoutedTeams, setScoutedTeams] = useState<number[]>();

  const data = useMemo(() => teamData?.[phase], [teamData, phase]);

  useEffect(() => {
    if (!teamNumber || !FRC_TEAM_NUMBERS.includes(teamNumber)) {
      return;
    }
    fetchTeamData(teamNumber, gameRecency ?? undefined)
      .then(setTeamData)
      .catch(alert);
  }, [teamNumber, gameRecency]);

  useEffect(() => {
    fetchTeamNumbers().then(setScoutedTeams).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col text-black items-center bg-slate-950">
      <TeamSelect
        teamNumber={teamNumber ?? undefined}
        gameRecency={gameRecency ?? undefined}
        setTeamNumber={setTeamNumber}
        setRecency={setGameRecency}
        scoutedTeams={scoutedTeams ?? []}
      />
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
                points: createShotDataset(data.fuel, "passed"),
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
                name: "Median Climb Time",
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
