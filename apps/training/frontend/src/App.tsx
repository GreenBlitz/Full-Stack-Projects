// בס"ד
import type { FC } from "react";
import { useEffect, useState } from "react";
import type { Duck } from "./componentsEyal/DuckCard";
import { Ducks } from "./componentsEyal/Ducks";
import { RemoveLastDuck } from "./componentsEyal/RemoveDuck";
import { CountDuck } from "./componentsEyal/CountDucks";
import { HowManyDucks } from "./componentsEyal/titleDucks";
import { CountDuckByColor } from "./componentsEyal/countDuckbyColor";
import { RngDuck } from "./componentsEyal/RngDuck";
import { AddDuck } from "./componentsEyal/AddDuck";
import axios from "axios";


import "./styling.css";

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

async function getSchool() {
  const response = await axios.get(
    "http://localhost:3001/school"
  );
  console.log(response.data);
}

const App: FC = () => {
  const [ducks, setDucks] = useState<Duck[]>(initialDucks);
  const [color, setColor] = useState("");
  const [randomDuck, setRandomDuck] = useState<Duck>();
  useEffect(() => {
    getSchool().catch((error) => {
      console.error("Could not load school:", error);
    });
  }, []);

  return (
    <div>
      <h1> Meet the "ducks"</h1>
      <Ducks ducks={ducks} />
      <RemoveLastDuck ducks={ducks} setDucks={setDucks} />
      <AddDuck
        onAddDuck={(newDuck) => {
          setDucks((currentDucks) => [...currentDucks, newDuck]);
        }}
      />
      <CountDuck ducks={ducks}></CountDuck>
      <HowManyDucks ducks={ducks}></HowManyDucks>
      <input style={{ backgroundColor: "lightgray", border: "1px solid #ccc", padding: "10px" }} type="text" placeholder="enter a duck color" value={color}  onChange={(event) => setColor(event.target.value)} />
      <CountDuckByColor ducks={ducks} color={color} />
      <button onClick={() => setDucks([...ducks].sort((a, b) => a.DuckName.localeCompare(b.DuckName)))}>Sort Ducks by Name</button>
      <button onClick={() => setDucks([...ducks].sort((a, b) => a.DuckColor.localeCompare(b.DuckColor)))}>Sort Ducks by color</button>
      <button onClick={() => setDucks([...ducks].sort((a, b) => a.DuckAge - b.DuckAge))}>Sort Ducks by age</button>
      <button onClick={() => setRandomDuck(RngDuck({ ducks }))} disabled={ducks.length === 0}>Random Duck</button>
       {randomDuck && <Ducks ducks={[randomDuck]} />}

    </div>
  );
};

export default App;

