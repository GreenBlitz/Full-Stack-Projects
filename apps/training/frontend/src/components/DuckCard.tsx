import "./style.css";
interface DuckCardProps {
  name: string;
  color: string;
  age: number;
}

export function DuckCard(duckCardProp: DuckCardProps) {
  return (
    <div className="duckCard">
      Duck name: {duckCardProp.name} <br />
      Duck color: {duckCardProp.color} <br />
      Duck age: {duckCardProp.age}
    </div>
  );
}
