import { useState } from "react";
import type { Duck } from "./DuckCard";

type AddDuckProps = {
  setducks: React.Dispatch<React.SetStateAction<Duck[]>>;
};

export function Addduck({ setducks }: AddDuckProps) {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [age, setAge] = useState<number>(0);

  const addDuck = () => {
    const duck3: Duck = { name, color, age };

    setducks((previousDucks) => [...previousDucks, duck3]);
  };

  return (
    <div>
      <label>Enter the duck's name</label>
      <input value={name} onChange={(event) => setName(event.target.value)} />

      <label>Enter the duck's color</label>
      <input value={color} onChange={(event) => setColor(event.target.value)} />

      <label>Enter the duck's age</label>
      <input
        type="number"
        value={age}
        onChange={(event) => setAge(Number(event.target.value))}
      />

      <button onClick={addDuck}>Add duck</button>
    </div>
  );
}
localStorage;
