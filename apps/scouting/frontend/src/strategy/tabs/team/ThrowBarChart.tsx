import type { TeamPageTeamBeeData } from "@repo/scouting_types";
import type { FC } from "react";
import { BarChart } from "../../components/BarChart";
import { getMax } from "@repo/array-functions";

const maxHeightWiggleRoom = 1.1; //10% offset so it doesnt go to the very top

export const maxHeight = (periodData: TeamPageTeamBeeData["auto" | "total"]) =>
  getMax(
    Object.entries(periodData.fuelPerGame.fuelScoredPerGame).map(
      ([match, value]) =>
        value + periodData.fuelPerGame.fuelPassedPerGame[match],
    ),
    (value) => value,
  );

export const ThrowBarChart: FC<{
  periodData: TeamPageTeamBeeData["auto" | "total"];
  max: number;
  title: string;
  brokenMatches: string[];
}> = ({ periodData, max, title, brokenMatches }) => {
  const { fuelScoredPerGame, fuelPassedPerGame } = periodData.fuelPerGame;

  const broken = new Set(brokenMatches);

  const split = (perGame: Record<string, number>, isBroken: boolean) =>
    Object.fromEntries(
      Object.entries(perGame).map(([match, value]) => [
        match,
        broken.has(match) === isBroken ? value : 0,
      ]),
    );

  const datasets = [
    {
      name: "Scored",
      color: "violet",
      points: split(fuelScoredPerGame, false),
    },
    { name: "Passed", color: "cyan", points: split(fuelPassedPerGame, false) },
    {
      name: "Scored (robot broke)",
      color: "#b91c1c",
      points: split(fuelScoredPerGame, true),
    },
    {
      name: "Passed (robot broke)",
      color: "#f97316",
      points: split(fuelPassedPerGame, true),
    },
  ];

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
          max={Number(
            Math.max(max, maxHeight(periodData) * maxHeightWiggleRoom).toFixed(
              2,
            ),
          )}
          stacked
        />
      </div>
    </>
  );
};
