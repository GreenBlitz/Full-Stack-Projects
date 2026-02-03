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
} from "chart.js";
import type { LineChartProps } from "./data-templates-for-charts";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
);

import type { ChartData, ChartOptions } from "chart.js";

const convertDataToValidFormat: ChartData<"line", number[], string> = ({
  dataSetsProps
}: DataSet<any>[] ) => {
  const labels = Object.keys(dataSetsProps[0]?.points ?? {});
  return {
    labels,
    datasets: dataSetsProps.map((ds) => ({
      label: ds.name,
      data: labels.map((l) => ds.points[l] ?? 0),
      borderColor: ds.color ?? "blue",
      fill: false,
    }))
  }
};

export const LineGraph = ({ dataSetsProps, min, max }: LineChartProps) => {
  

  const data: ChartData<"line", number[], string> = {
    labels,
    datasets: dataSetsProps.map((ds) => ({
      label: ds.name,
      data: labels.map((l) => ds.points[l] ?? 0),
      borderColor: ds.color ?? "blue",
      fill: false,
    })),
  };

  const options: ChartOptions<"line"> = {
    scales: {
      y: { min, max },
    },
  };

  return <Line data={data} options={options} />;
};
