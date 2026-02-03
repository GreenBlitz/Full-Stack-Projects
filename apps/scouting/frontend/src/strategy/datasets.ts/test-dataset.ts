// בס"ד
import type { DataSet, LineChartProps } from "../data-templates-for-charts";

export const scoringQual1: DataSet<string> = {
  name: "scoringQual1",
  points: {
    "GreenBlitz 4590": 50,
    "Orbit 1690": 30,
    "Makers Assenble 5951": 40
  },
  color: "green",
};

export const lineChartProps: LineChartProps = {
  dataSetsProps: [scoringQual1],
  max: 100,
  min: 0,
};
