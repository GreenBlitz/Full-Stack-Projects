import { DuckCard, type DuckCardProps } from "./DuckCard";

export interface DuckProps {
  ducks: DuckCardProps[];
}

export function Duck({ ducks }: DuckProps) {
  return ducks.map((duck) => (
    <DuckCard name={duck.name} color={duck.color} age={duck.age} />
  ));
}
