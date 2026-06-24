import type { TeamPageTeamBeeData } from "@repo/scouting_types";
import type { FC } from "react";
import type { BarDataset, PointDataset } from "../../Dataset";
import { BarChart } from "../../components/BarChart";

export const SuperBarChart: FC<{ superData: TeamPageTeamBeeData["super"] }> = ({
  superData,
}) => {
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

  return <BarChart dataSetsProps={datasets} min={0} max={5} />;
};
