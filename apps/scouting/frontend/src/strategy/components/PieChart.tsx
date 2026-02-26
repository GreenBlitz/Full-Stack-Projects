//בס"ד
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";

import type { ChartData, ChartOptions } from "chart.js";
import type { PieDataset } from "../Dataset";
import type { FC } from "react";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
);

const convertDataToPieChartFormat = ({
  name,
  points,
  color,
}: PieDataset<string | number>): ChartData<"pie", number[], string> => {
  const defaultColor = "red";

  const labels = Object.keys(points);
  const values = Object.values(points);

  return {
    labels,
    datasets: [
      {
        label: name,
        data: values.map((point) => point),
        backgroundColor: labels.map(() => color ?? defaultColor),
      },
    ],
  };
};

export const PieGraph: FC<PieDataset<string | number>> = ({
  name,
  points,
  color,
}) => {
  const data = convertDataToPieChartFormat({ name, points, color });
  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
  };
  return <Pie data={data} options={options} />;
};
