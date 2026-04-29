// בס"ד
import type {
  GamePhase,
  MatchedEntry,
  Match,
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
import { HeatMap } from "../../components/heatmap/HeatMap";
import { redField } from "@repo/rebuilt_map";
import { fetchTeamNumbers } from "../../fetches";
import { PieGraph } from "../../components/PieChart";
import { PitScoutResultsTab } from "../pit-scout/TeamPitShow";
import { ScoutingFormView } from "../../ScoutingFormView";

const METER_AND_HALF_CENTIMETERS = 150;
const THREE_METER_CENTIMETERS = 300;
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

const FIRST_MATCH_TYPE_CHARACTER = 0;

const formatNoShowMatch = (m: Match) =>
  `${m.type[FIRST_MATCH_TYPE_CHARACTER]}${m.number}`;

const graphSection =
  "w-96 h-64 p-4 items-center bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl";
export const TeamTab: FC = () => {
  const [phase, setPhase] = useState<"pit" | "forms">("pit");
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
      <MetricsChart
        epa={teamData?.metrics.epa}
        coprs={teamData?.metrics.coprs}
      />
      {phase === "forms" && teamData && teamData.forms.length > 0 && (
        <ScoutingFormView form={teamData?.forms[0]} />
      )}
      {phase === "pit" && <PitScoutResultsTab teamNumber={teamNumber} />}
    </div>
  );
};
