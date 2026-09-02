interface DuckCardProps {
  name: string;
  color: string;
  age: number;
}

export function DuckCard({ name, color, age }: DuckCardProps) {
  return (
    <div className="aspect-2/3 m-px">
      <link href="CSS.css" rel="stylesheet" />
      <span>name: {name}</span>
      <br />
      <span>color: {color}</span>
      <br />
      <span>age: {age}</span>
      <br />
    </div>
  );
}
