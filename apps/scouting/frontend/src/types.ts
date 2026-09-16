// בס"ד

import type { PointStyle } from "chart.js";

export interface DataPoint {
  value: number;
  pointStyle?: PointStyle;
}
export interface DataSet<T extends string | number, Point> {
  name: string;
  points: Record<T, Point>;
  color?: string;
}

export interface PointDataset<T extends string | number> extends DataSet<
  T,
  DataPoint
> {
  size?: number;
}

export type PieDataset<T extends string | number> = DataSet<
  T,
  { value: number; color: string }
>;

export type BarDataset<T extends string | number> = DataSet<T, number>;
