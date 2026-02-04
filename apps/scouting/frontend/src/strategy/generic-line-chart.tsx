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

import type { ChartData, ChartOptions } from "chart.js";
import type { LineChartProps } from "./data-templates-for-charts";

const convertDataToLineChartFormat = ({
  dataSetsProps,
}: LineChartProps): ChartData<"line", number[], string> => {
  const labels = Array.from(
    new Set(dataSetsProps.flatMap((ds) => Object.keys(ds.points))),
  );

  return {
    labels,
    datasets: dataSetsProps.map((dataset) => ({
      label: dataset.name,
      data: labels.map((label) => dataset.points[label] ?? null), // 👈 gap, not fake zero
      borderColor: dataset.color ?? "blue",
      fill: false,
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
