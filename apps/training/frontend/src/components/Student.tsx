interface StudentProps {
  data: string;
}

export function Student({ data }: StudentProps) {
  return <div>{data}</div>;
}
