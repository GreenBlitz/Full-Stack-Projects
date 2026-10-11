import { useState } from "react";
import type { Duck } from "./DuckCard";

export function Addduck() {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [age, setAge] = useState<number>(0);

  const duck3: Duck = { name, color, age };

  return (
    <div>
      <label>enter the duck's name</label>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <label>enter the duck's color</label>
      <input
        type="text"
        value={color}
        onChange={(event) => setColor(event.target.value)}
      />

      <label>enter the duck's age</label>
      <input
        type="number"
        value={age}
        onChange={(event) => setAge(Number(event.target.value))}
      />

      <p>
        {duck3.name} {duck3.color} {duck3.age}
      </p>
    </div>
  );
}
