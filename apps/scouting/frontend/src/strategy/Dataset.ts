// בס"ד
export interface DataSet<T extends string | number> {
  name: string;
  points: Record<T, number>;
  color?: string; //assign color if not defined
}


