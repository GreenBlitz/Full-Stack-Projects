interface DuckCardProps {
  name: string;
  color: string;
  age: number;
}

export function DuckCard({ name, color, age }: DuckCardProps) {
  return (
    <>
      <span>name: {name}</span>
      <br />
      <span>color: {color}</span>
      <br />
      <span>age: {age}</span>
    </>
  );
}