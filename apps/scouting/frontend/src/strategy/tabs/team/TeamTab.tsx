// בס"ד
import type {
  Match,
  TeamData,
  TeamPageTeamBeeData,
} from "@repo/scouting_types";
import { useEffect, useState, type FC } from "react";
import { FRC_TEAM_NUMBERS } from "@repo/frc";
import { firstElement } from "@repo/array-functions";
import { TeamSelect } from "./TeamSelect";
import { PhaseToggle } from "../../components/PhaseToggle";
import { MetricsChart } from "../../components/MetricsChart";
import { useLocalStorage } from "@repo/local_storage_hook";
import { fetchTeamNumbers } from "../../fetches";
import { PitScoutResultsTab } from "../pit-scout/TeamPitShow";
import { ScoutingFormView } from "../../ScoutingFormView";

const TEAM_DATA_URL = "/api/v1/teamPage";
const NO_DATA_ON_TEAM_STATUS = 502;
async function fetchTeamData(team: number, recency?: number) {
  const response = await fetch(`${TEAM_DATA_URL}?teams=${team}`);

  if (response.status === NO_DATA_ON_TEAM_STATUS) {
    alert(`No Data on ${team} yet`);
    return undefined;
  }

  const data: {
    teams: Record<number, TeamPageTeamBeeData>;
  } = await response.json();
  return firstElement(Object.values(data.teams));
}

const FIRST_MATCH_TYPE_CHARACTER = 0;

const formatNoShowMatch = (m: Match) =>
  `${m.type[FIRST_MATCH_TYPE_CHARACTER]}${m.number}`;

const graphSection =
  "w-96 h-64 p-4 items-center bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl";
export const TeamTab: FC = () => {
  const [teamData, setTeamData] = useState<TeamPageTeamBeeData>();
  const [teamNumber, setTeamNumber] = useLocalStorage<number | null>(
    "team/teamNumber",
    null,
  );
  const [gameRecency, setGameRecency] = useLocalStorage<number | null>(
    "team/recency",
    null,
  );
  const [scoutedTeams, setScoutedTeams] = useState<number[]>();

  const [formIndex, setFormIndex] = useState(0);

  // reset index when team changes
  useEffect(() => {
    setFormIndex(0);
  }, [teamNumber]);

  useEffect(() => {
    if (!teamNumber || !FRC_TEAM_NUMBERS.includes(teamNumber)) {
      return;
    }
    fetchTeamData(teamNumber, gameRecency ?? undefined)
      .then(setTeamData)
      .catch(alert);
  }, [teamNumber, gameRecency]);

  useEffect(() => {
    fetchTeamNumbers()
      .then((teams) => {
        console.log("fetched team numbers:", teams);
        setScoutedTeams(teams);
      })
      .catch(console.error);
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
      {/* <PhaseToggle activeMode={phase} setActiveMode={setPhase} />
      <MetricsChart
        epa={teamData?.metrics.epa}
        coprs={teamData?.metrics.coprs}
      /> */}
      {/* {phase === "forms" && teamData && teamData.forms.length > 0 && (
        <div className="flex flex-col items-center w-full max-w-2xl">
          <div className="flex items-center justify-between w-full px-4 mb-2">
            <button
              onClick={() => setFormIndex((i) => Math.max(0, i - 1))}
              disabled={formIndex === 0}
              className="px-6 py-3 bg-slate-800 border border-white/10 rounded-lg text-slate-300 text-sm font-black disabled:opacity-30 hover:bg-slate-700 transition-all active:scale-95"
            >
              ←
            </button>
            <span className="text-xl font-bold uppercase text-slate-500">
              Form {formIndex + 1} / {teamData.forms.length}
            </span>
            <button
              onClick={() =>
                setFormIndex((i) => Math.min(teamData.forms.length - 1, i + 1))
              }
              disabled={formIndex === teamData.forms.length - 1}
              className="px-6 py-3 bg-slate-800 border border-white/10 rounded-lg text-slate-300 text-sm font-black disabled:opacity-30 hover:bg-slate-700 transition-all active:scale-95"
            >
              →
            </button>
          </div> */}
      {/* <ScoutingFormView form={teamData.forms[formIndex]} /> */}
      {/* </div> */}
      {/* )} */}
      {/* {phase === "pit" && <PitScoutResultsTab teamNumber={teamNumber} />} */}
    </div>
  );
};
