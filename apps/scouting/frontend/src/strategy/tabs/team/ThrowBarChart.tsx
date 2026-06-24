import type { TeamPageTeamBeeData } from "@repo/scouting_types";
import type { FC } from "react";
import { BarChart } from "../../components/BarChart";
import { getMax } from "@repo/array-functions";

const maxHeightWiggleRoom = 1.1; //10% offset so it doesnt go to the very top

export const ThrowBarChart: FC<{
  periodData: TeamPageTeamBeeData["auto" | "tele"];
  max: number;
  title: string;
}> = ({ periodData, max, title }) => {
  const datasets = [
    {
      name: "Scored",
      color: "violet",
      points: Object.fromEntries(
        Object.entries(periodData.fuelPerGame.fuelScoredPerGame).map(
          ([match, value]) => [match, value],
        ),
      ),
    },
    {
      name: "Passed",
      color: "cyan",
      points: Object.fromEntries(
        Object.entries(periodData.fuelPerGame.fuelPassedPerGame).map(
          ([match, value]) => [match, value],
        ),
      ),
    },
  ];

  const maxHeight = getMax(
    Object.entries(periodData.fuelPerGame.fuelScoredPerGame).map(
      ([match, value]) =>
        value + periodData.fuelPerGame.fuelPassedPerGame[match],
    ),
    (value) => value,
  );
  return (
    <>
      <div className="w-full max-w-xl mx-auto bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl text-center">
        <p className="text-xs text-slate-200 uppercase tracking-wider font-bold">
          {title}
        </p>
      </div>
      <div className="flex justify-center w-full h-76">
        <BarChart
          dataSetsProps={datasets}
          min={0}
          max={Math.max(max, maxHeight * maxHeightWiggleRoom)}
          stacked
        />
      </div>
    </>
  );
};
