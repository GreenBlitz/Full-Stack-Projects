// בס"ד
import type { FC } from "react";
import { useState } from "react";
import type { Duck } from "./componentsEyal/DuckCard";
import { Ducks } from "./componentsEyal/Ducks";
import { RemoveLastDuck } from "./componentsEyal/RemoveDuck";
import { CountDuck } from "./componentsEyal/CountDucks";
import { HowManyDucks } from "./componentsEyal/titleDucks";
import { CountDuckByColor } from "./componentsEyal/countDuckbyColor";
import { RngDuck } from "./componentsEyal/RngDuck";

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
  const [color, setColor] = useState("");
  const [randomDuck, setRandomDuck] = useState<Duck>();

  return (
    <div>
      <h1> Meet the "ducks"</h1>
      <Ducks ducks={ducks} />
      <RemoveLastDuck ducks={ducks} setDucks={setDucks} />
      <CountDuck ducks={ducks}></CountDuck>
      <HowManyDucks ducks={ducks}></HowManyDucks>
      <input type="text" placeholder="enter a duck color" value={color}  onChange={(event) => setColor(event.target.value)} />
      <CountDuckByColor ducks={ducks} color={color} />
      <button onClick={() => setRandomDuck(RngDuck({ ducks }))} disabled={ducks.length === 0}>
        Random Duck
      </button>
      {randomDuck && <Ducks ducks={[randomDuck]} />}
    </div>
  );
};

export default App;
