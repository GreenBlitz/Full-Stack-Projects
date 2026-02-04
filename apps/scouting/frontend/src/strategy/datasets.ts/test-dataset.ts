// בס"ד
import type { DataSet, LineChartProps } from "../data-templates-for-charts";

export const greenBlitzQuals: DataSet<string> = {
  name: "greenBlitzQuals",
  points: {
    1: 50,
    2: 30,
    3: 40,
    6: 33,
    9: 22,
  },
  color: "green",
};

export const maQuals: DataSet<string> = {
  name: "maQuals",
  points: {
    1: 10,
    2: 20,
    3: 60,
    4: 80,
    5: 20,
  },
  color: "red",
};

export const lineChartProps: LineChartProps = {
  dataSetsProps: [greenBlitzQuals, maQuals],
  max: 100,
  min: 0,
};
