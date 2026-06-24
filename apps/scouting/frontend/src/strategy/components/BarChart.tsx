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
import type { BarDataset, PieDataset } from "../Dataset";
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
  dataSetsProps: BarDataset<string | number>[];
  max?: number;
  min?: number;
}
const convertDataToBarChartFormat = ({
  dataSetsProps,
  useDefaultColors,
}: BarChartProps): ChartData<"bar", number[], string> => {
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
        backgroundColor: useDefaultColors ? defaultColors : dataset.color,
      };
    }),
  };
};

interface BarChartProps extends LineChartProps {
  stacked?: boolean;
  useDefaultColors?: boolean;
}

export const BarChart: FC<BarChartProps> = ({
  dataSetsProps,
  min,
  max,
  stacked,
  useDefaultColors,
}) => {
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
        stacked,
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
        stacked,
      },
    },
  };
  const data = convertDataToBarChartFormat({ dataSetsProps, useDefaultColors });
  return <Bar data={data} options={options} />;
};
