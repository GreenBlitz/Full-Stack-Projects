// בס"ד
import type { Match, TeamPageTeamBeeData } from "@repo/scouting_types";
import { useEffect, useState, type FC } from "react";
import { FRC_TEAM_NUMBERS } from "@repo/frc";
import { firstElement } from "@repo/array-functions";
import { TeamSelect } from "./TeamSelect";
import { useLocalStorage } from "@repo/local_storage_hook";
import { fetchTeamNumbers } from "../../fetches";

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

  const [hasData, setHasData] = useState<boolean>();

  const [scoutedTeams, setScoutedTeams] = useState<number[]>();

  const [formIndex, setFormIndex] = useState(0);

  // reset index when team changes
  useEffect(() => {
    setFormIndex(0);
  }, [teamNumber]);

  useEffect(() => {
    if (!teamNumber || !FRC_TEAM_NUMBERS.includes(teamNumber)) {
      setHasData(false);
      return;
    }
    setHasData(true);
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
    </div>
  );
};
