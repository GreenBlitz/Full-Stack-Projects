// בס"ד
interface DataSet<T extends string | number> {
  name: string;
  points: Record<T, number>;
  color?: string; //assign color if not defined
}

interface LineChartProps<T extends string | number> {
  dataSets: DataSet<T>[];
  max?: number;
  min?: number;
}