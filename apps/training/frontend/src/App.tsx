// בס"ד
import type { FC } from "react";
import { useState } from "react";
import type { Duck } from "./componentsEyal/DuckCard";
import { Ducks } from "./componentsEyal/Ducks";
import { RemoveLastDuck } from "./componentsEyal/RemoveDuck";
import { CountDuck } from "./componentsEyal/CountDucks";

const initialDucks: Duck[] = [
  {
    DuckName: "it that betrays",
    DuckColor: "lightGray",
    DuckAge: 2,
  },
  {
    DuckName: "emrakuls crusher",
    DuckColor: "lightblue",
    DuckAge: 2,
  },
  {
    DuckName: "it that herolds the end",
    DuckColor: "lightGray",
    DuckAge: 1,
  },
  {
    DuckName: "Ulamog, the Ceaseless Hunger",
    DuckColor: "white",
    DuckAge: 5,
  },
  {
    DuckName: "Kozilek, the Great Distortion",
    DuckColor: "blue",
    DuckAge: 4,
  },
  {
    DuckName: "Emrakul, the Promised End",
    DuckColor: "purple",
    DuckAge: 6,
  },
  {
    DuckName: "Void Winnower",
    DuckColor: "black",
    DuckAge: 3,
  },
];

const App: FC = () => {
  const [ducks, setDucks] = useState<Duck[]>(initialDucks);

  return (
    <div>
      <h1> Meet the "ducks"</h1>
      <Ducks ducks={ducks} />
      <RemoveLastDuck ducks={ducks} setDucks={setDucks} />
      <CountDuck ducks={ducks}></CountDuck>
    </div>
  );
};

export default App;
