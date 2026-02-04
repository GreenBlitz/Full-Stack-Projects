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

const convertDataToPieChartFormat = ({
  name,
  points,
  color,
}: DataSet<string | number>): ChartData<"pie", number[], string> => {
  const labels = Object.keys(points);
  const values = Object.values(points);

  return {
    labels,
    datasets: [
      {
        label: name,
        data: values,
        backgroundColor: labels.map(() => color ?? "blue"), // optional
      },
    ],
  };
};

export const PieGraph = ({ name, points, color }: DataSet<string | number>) => {
  const data = convertDataToPieChartFormat({ name, points, color });
  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
  };
  return <Pie data={data} options={options} />;
};
