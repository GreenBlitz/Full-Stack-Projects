interface SchoolDataProps {
  data: string;
}

export function SchoolData({ data }: SchoolDataProps) {
  return <div>{data}</div>;
}
