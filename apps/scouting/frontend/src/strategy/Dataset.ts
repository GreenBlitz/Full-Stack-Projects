// בס"ד

import type { PointStyle } from "chart.js";

export interface DataPoint {
  value: number;
  pointStyle?: PointStyle;
}
export interface DataSet<T extends string | number, Point> {
  name: string;
  points: Record<T, Point>;
  color?: string; //assign color if not defined
}

export type PointDataset<T extends string | number> = DataSet<T, DataPoint>;

export type PieDataset<T extends string | number> = DataSet<T, number>;
