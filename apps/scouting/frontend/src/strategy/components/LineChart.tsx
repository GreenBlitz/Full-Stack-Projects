//בס"ד
import { Line } from "react-chartjs-2";
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
import type { DataPoint, PointDataset } from "../Dataset";
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

export interface LineChartProps {
  dataSetsProps: PointDataset<string | number>[];
  max?: number;
  min?: number;
}
const convertDataToLineChartFormat = ({
  dataSetsProps,
}: LineChartProps): ChartData<"line", number[], string> => {
  const defaultColors = ["blue", "red", "violet", "orange"];

  const labels = Array.from(
    new Set(dataSetsProps.flatMap((dataset) => Object.keys(dataset.points))),
  ).sort((a, b) => Number(a) - Number(b));

  return {
    labels,
    datasets: dataSetsProps.map((dataset, index) => {
      const dataPoints = labels.map<DataPoint | null>(
        (label) => dataset.points[label] ?? null,
      );

      const color =
        dataset.color ?? defaultColors[index % defaultColors.length];
      return {
        label: dataset.name,
        data: dataPoints.map((point) => point?.value) as number[],
        pointStyle: (context) => dataPoints[context.dataIndex]?.pointStyle,
        borderColor: color,
        pointRadius: dataset.size,
        pointBackgroundColor: color,
      };
    }),
  };
};

export const LineChart: FC<LineChartProps> = ({ dataSetsProps, min, max }) => {
  const options: ChartOptions<"line"> = {
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
  const data = convertDataToLineChartFormat({ dataSetsProps });
  return <Line data={data} options={options} />;
};
