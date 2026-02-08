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
import type { DataSet, PointDataset } from "./Dataset";
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
  dataSetsProps: PointDataset<any>[];
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
      const dataPoints = labels.map((label) => dataset.points[label] ?? null);

      return {
        label: dataset.name,
        data: dataPoints.map((point) =>
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          point ? point.value : null,
        ) as number[],
        pointStyle: (context) => dataPoints[context.dataIndex].pointStyle,
        borderColor:
          dataset.color ?? defaultColors[index % defaultColors.length],
      };
    }),
  };
};

export const LineGraph: FC<LineChartProps> = ({ dataSetsProps, min, max }) => {
  const options: ChartOptions<"line"> = {
    scales: {
      y: { min, max },
    },
  };
  const data = convertDataToLineChartFormat({ dataSetsProps });
  return <Line data={data} options={options} />;
};
