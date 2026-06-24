// בס"ד
import type { Match, TeamPageTeamBeeData } from "@repo/scouting_types";
import { useEffect, useState, type FC } from "react";
import { FRC_TEAM_NUMBERS } from "@repo/frc";
import { firstElement } from "@repo/array-functions";
import { TeamSelect } from "./TeamSelect";
import { useLocalStorage } from "@repo/local_storage_hook";
import { fetchTeamNumbers } from "../../fetches";
import { StatView } from "./StatView";
import { PitScoutResultsTab } from "../pit-scout/TeamPitShow";

const TEAM_DATA_URL = "/api/v1/teamPage";
const NO_DATA_ON_TEAM_STATUS = 502;
async function fetchTeamData(team: number) {
  const response = await fetch(
    `${TEAM_DATA_URL}?teamNumber=${team.toString()}`,
  );

  if (response.status === NO_DATA_ON_TEAM_STATUS) {
    alert(`No Data on ${team} yet`);
    return undefined;
  }

  const data: {
    teamPageData: Record<number, TeamPageTeamBeeData>;
  } = await response.json();
  return firstElement(Object.values(data.teamPageData));
}

export const TeamTab: FC = () => {
  const [teamData, setTeamData] = useState<TeamPageTeamBeeData>();
  const [teamNumber, setTeamNumber] = useLocalStorage<number | null>(
    "team/teamNumber",
    null,
  );

  const [scoutedTeams, setScoutedTeams] = useState<number[]>();

  // const [formIndex, setFormIndex] = useState(0);

  // // reset index when team changes
  // useEffect(() => {
  //   setFormIndex(0);
  // }, [teamNumber]);

  useEffect(() => {
    if (!teamNumber || !FRC_TEAM_NUMBERS.includes(teamNumber)) {
      return;
    }
    fetchTeamData(teamNumber).then(setTeamData).catch(alert);
  }, [teamNumber]);

  useEffect(() => {
    fetchTeamNumbers().then(setScoutedTeams).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col text-slate-200 items-center justify-start min-h-screen bg-slate-950 px-4 py-6 w-full">
      <div className="w-full max-w-2xl bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl mb-4 flex justify-center items-center">
        <TeamSelect
          teamNumber={teamNumber ?? undefined}
          setTeamNumber={setTeamNumber}
          scoutedTeams={scoutedTeams ?? []}
        />
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 w-full">
          <StatView
            statContent={teamData?.auto.fuelAverage.scored
              .toFixed(2)
              .toString()}
            statName={"Auto Points"}
          />
          <StatView
            statContent={teamData?.tele.fuelAverage.scored
              .toFixed(2)
              .toString()}
            statName={"Teleop Points"}
          />
        </div>

        <PitScoutResultsTab teamNumber={teamNumber} />

        <div className="grid grid-cols-3 gap-4 w-full">
          <StatView
            statContent={teamData?.super.defense.toFixed(2).toString()}
            statName={"Defense"}
          />
          <StatView
            statContent={teamData?.super.evasion.toFixed(2).toString()}
            statName={"Evasion"}
          />
          <StatView
            statContent={teamData?.super.driving.toFixed(2).toString()}
            statName={"Driving"}
          />
        </div>
      </div>
    </div>
  );
};
