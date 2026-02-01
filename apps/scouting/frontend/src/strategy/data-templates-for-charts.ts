// בס"ד
interface DataSet<T extends string | number> {
  name: string;
  points: Record<T, number>;
  color?: string; //assign color if not defined
}

export interface LineChartProps{
  dataSets: DataSet<any>[];
  max?: number;
  min?: number;
}