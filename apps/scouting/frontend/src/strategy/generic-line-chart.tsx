//בס"ד
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { lineChartData } from './datasets.ts/test-dataset';
import type { LineChartProps } from './data-templates-for-charts';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const LineGraph = (lineChartProps: LineChartProps) =>{
    return <Line options={{}} data={lineChartProps.dataSets} />
}