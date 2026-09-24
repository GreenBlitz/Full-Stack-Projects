import "./style.css";
export interface DuckCardProps {
  name: string;
  color: string;
  age: number;
}

export function DuckCard({name, color, age}: DuckCardProps) {
  return (
    <div className="duckCard">
      Duck name: {name} <br />
      Duck color: {color} <br />
      Duck age: {age}
    </div>
  );
}
