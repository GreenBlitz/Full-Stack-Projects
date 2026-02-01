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
import { lineChartData } from './data-for-charts';

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

export const LineGraph = () =>{
    return <Line options={{}} data={lineChartData} />
}