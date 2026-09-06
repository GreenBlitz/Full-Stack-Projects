import * as fetches from "../fetches.ts";
import { type Duck, DuckCard } from "./DuckCard.tsx";
import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import { DuckAdder } from "./DuckAdder.tsx";
import { DuckMessage } from "./DuckMessage.tsx";

export type DucksProps = {
  ducks: Duck[];
  setDucks: Dispatch<SetStateAction<Duck[]>>;
};

export function Ducks({ ducks, setDucks }: DucksProps) {
  const [filter, setFilter] = useState("");
  const filterChanger = (changeEvent: ChangeEvent<HTMLInputElement>) =>
    setFilter(changeEvent.target.value);
  const removeLastDuck = () => {
    const duck = ducks.at(-1);
    if (duck) {
      fetches.deleteDuck(duck.id).then(setDucks);
    }
  };
  const duckSortingFunctionsMap = new Map<string, (a: Duck, b: Duck) => number>(
    [
      [
        "name",
        (a: Duck, b: Duck) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      ],
      [
        "color",
        (a: Duck, b: Duck) =>
          a.color.toLowerCase().localeCompare(b.color.toLowerCase()),
      ],
      ["age", (a: Duck, b: Duck) => a.age - b.age],
    ],
  );
  const [duckSortingFunction, setDuckSortingFunction] = useState<
    ((a: Duck, b: Duck) => number) | undefined
  >(() => duckSortingFunctionsMap.get("name"));
  const duckSortingFunctionChanger = (
    changeEvent: ChangeEvent<HTMLSelectElement>,
  ) =>
    setDuckSortingFunction(() =>
      duckSortingFunctionsMap.get(changeEvent.target.value),
    );
  const duckSortingFunctionReverse = () =>
    setDuckSortingFunction(() =>
      duckSortingFunction
        ? (a: Duck, b: Duck) => duckSortingFunction(b, a)
        : undefined,
    );

  return (
    <>
      <h2>The Ducks:</h2>
      <DuckMessage duckNumber={ducks.length} />
      <input
        type={"search"}
        onChange={filterChanger}
        placeholder={"Search..."}
      />
      <br />
      <label>Sort by: </label>
      <select onChange={duckSortingFunctionChanger}>
        <option>name</option>
        <option>color</option>
        <option>age</option>
      </select>
      <label> reverse: </label>
      <input type={"checkbox"} onChange={duckSortingFunctionReverse} />
      {ducks
        .filter((duck: Duck) =>
          duck.name.toLowerCase().includes(filter.toLowerCase()),
        )
        .sort(duckSortingFunction)
        .map((duck: Duck) => (
          <>
            <DuckCard duck={duck} />
            <br />
          </>
        ))}
      <button className={"remove-button"} onClick={removeLastDuck}>
        Remove Last
      </button>
      <br />
      <DuckAdder setDucks={setDucks} />
    </>
  );
}
