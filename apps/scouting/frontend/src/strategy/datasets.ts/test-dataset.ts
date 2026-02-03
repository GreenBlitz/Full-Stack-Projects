// בס"ד
import type { DataSet, LineChartProps } from "../data-templates-for-charts";

export const scoring4590: DataSet<string> = {
    name: "4590",
    points: {
        1: 50,
        2: 30,
        3:40
    },
    color: "green"
};

export const lineChartProps: LineChartProps  = {
    dataSetsProps: [scoring4590],
    max: 100,
    min: 0
}