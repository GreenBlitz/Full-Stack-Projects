// בס"ד

import type { PointStyle } from "chart.js";

export interface DataPoint {
  value: number;
  className?: PointStyle;
}
export interface DataSet<T extends string | number> {
  name: string;
  points: Record<T, DataPoint>;
  color?: string; //assign color if not defined
}
