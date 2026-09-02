import { Duck, type DuckProps } from "./Duck";

interface DucksProps {
  ducks: DuckProps[];
}

export function Ducks({ ducks }: DucksProps) {
  (return <div>
    {ducks.map((duck) => {<Duck name={duck.name} color={duck.color} age={duck.age}} >)}
  </div>)
}
