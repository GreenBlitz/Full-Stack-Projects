//בס"ד
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

import type { ChartData, ChartOptions } from "chart.js";
import type { PieDataset } from "../Dataset";
import type { FC } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
);

export interface LineChartProps {
  dataSetsProps: PieDataset<string | number>[];
  max?: number;
  min?: number;
}
const convertDataToBarChartFormat = ({
  dataSetsProps,
}: LineChartProps): ChartData<"bar", number[], string> => {
  const defaultColors = ["red", "violet", "orange"];

  const labels = Array.from(
    new Set(dataSetsProps.flatMap((dataset) => Object.keys(dataset.points))),
  ).sort((a, b) => Number(a) - Number(b));

  return {
    labels,
    datasets: dataSetsProps.map((dataset) => {
      return {
        label: dataset.name,
        data: labels.map((label) => dataset.points[label] ?? null),
        backgroundColor: defaultColors,
      };
    }),
  };
};

export const BarChart: FC<LineChartProps> = ({ dataSetsProps, min, max }) => {
  const options: ChartOptions<"bar"> = {
    scales: {
      x: {
        ticks: {
          color: "white",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      y: {
        min,
        max,
        ticks: {
          color: "white",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
  };
  const data = convertDataToBarChartFormat({ dataSetsProps });
  return <Bar data={data} options={options} />;
};
