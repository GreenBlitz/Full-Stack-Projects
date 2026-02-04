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
import type { DataSet } from "./dataset-template";

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
  dataSetsProps: DataSet<any>[];
  max?: number;
  min?: number;
}
const convertDataToLineChartFormat = ({
  dataSetsProps,
}: LineChartProps): ChartData<"line", number[], string> => {
  const labels = Array.from(
    new Set(dataSetsProps.flatMap((ds) => Object.keys(ds.points))),
  ).sort((a, b) => Number(a) - Number(b));

  return {
    labels,
    datasets: dataSetsProps.map((dataset) => ({
      label: dataset.name,
      data: labels.map((label) => dataset.points[label] ?? null),
      borderColor: dataset.color ?? "blue",
    })),
  };
};

export const LineGraph = ({ dataSetsProps, min, max }: LineChartProps) => {
  const options: ChartOptions<"line"> = {
    scales: {
      y: { min, max },
    },
  };
  const data = convertDataToLineChartFormat({ dataSetsProps });
  return <Line data={data} options={options} />;
};
