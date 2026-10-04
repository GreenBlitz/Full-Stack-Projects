import { Badge1 } from "../Badge1";
import type { Duck } from "../DuckCard";
interface Ducks1Props {
  ducks: Duck[];
}

export function Ducks1({ ducks }: Ducks1Props) {
  return (
    <div>
      {ducks.map((duck) => (
        <Badge1 name={duck.name} color={duck.color} age={duck.age} />
      ))}
    </div>
  );
}
