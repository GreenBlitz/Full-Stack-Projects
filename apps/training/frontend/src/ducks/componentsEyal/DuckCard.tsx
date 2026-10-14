import { Card } from "../../Card";

export interface Duck {
  DuckName: string;
  DuckColor: string;
  DuckAge: number;
}

export function DuckCard({ DuckName, DuckColor, DuckAge }: Duck) {
  return (
    <Card>
      <span style={{ color: DuckColor }}>
        {DuckName} : {DuckColor} : {DuckAge}
      </span>
    </Card>
  );
}
