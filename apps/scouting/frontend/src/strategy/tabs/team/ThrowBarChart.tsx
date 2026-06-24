import type { TeamPageTeamBeeData } from "@repo/scouting_types";
import type { FC } from "react";
import { BarChart } from "../../components/BarChart";
import { getMax } from "@repo/array-functions";

const maxHeightWiggleRoom = 1.1; //10% offset so it doesnt go to the very top

export const ThrowBarChart: FC<{
  periodData: TeamPageTeamBeeData["auto" | "tele"];
  max: number;
}> = ({ periodData, max }) => {
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
    <BarChart
      dataSetsProps={datasets}
      min={0}
      max={Math.max(max, maxHeight * maxHeightWiggleRoom)}
      stacked
    />
  );
};
