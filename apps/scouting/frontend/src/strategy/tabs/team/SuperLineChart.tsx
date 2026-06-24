import type { TeamPageTeamBeeData } from "@repo/scouting_types";
import type { FC } from "react";
import type { PointDataset } from "../../Dataset";
import { LineChart } from "../../components/LineChart";

export const SuperLineChart: FC<{ superData: TeamPageTeamBeeData["super"] }> = ({
  superData,
}) => {
  const datasets: PointDataset<string>[] = [
    {
      name: "Defense",
      color: "red",
      points: Object.fromEntries(
        Object.entries(superData.defensePerGame).map(([match, value]) => [
          match,
          { value },
        ]),
      ),
    },
    {
      name: "Evasion",
      color: "blue",
      points: Object.fromEntries(
        Object.entries(superData.evasionPerGame).map(([match, value]) => [
          match,
          { value },
        ]),
      ),
    },
  ];

  return <LineChart dataSetsProps={datasets} min={0} max={5} />;
};
