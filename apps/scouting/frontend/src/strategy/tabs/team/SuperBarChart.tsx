import type { TeamPageTeamBeeData } from "@repo/scouting_types";
import type { FC } from "react";
import type { BarDataset, PointDataset } from "../../Dataset";
import { BarChart } from "../../components/BarChart";

export const SuperBarChart: FC<{
  superData: TeamPageTeamBeeData["super"];
}> = ({ superData }) => {
  const datasets: BarDataset<string>[] = [
    {
      name: "Defense",
      color: "red",
      points: Object.fromEntries(
        Object.entries(superData.defensePerGame).map(([match, value]) => [
          match,
          value,
        ]),
      ),
    },
    {
      name: "Evasion",
      color: "blue",
      points: Object.fromEntries(
        Object.entries(superData.evasionPerGame).map(([match, value]) => [
          match,
          value,
        ]),
      ),
    },
  ];

  return (
    <>
      <div className="w-full max-w-xl mx-auto bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl text-center">
        <p className="text-xs text-slate-200 uppercase tracking-wider font-bold">
          Super
        </p>
      </div>
      <div className="flex justify-center w-full h-76">
        <BarChart dataSetsProps={datasets} min={0} max={5} />
      </div>
    </>
  );
};
