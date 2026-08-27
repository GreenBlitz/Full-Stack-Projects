import * as fetches from "./fetches.ts";
import { Ducks } from "./ducks/Ducks.tsx";
import type { Duck } from "./ducks/DuckCard.tsx";
import { useEffect, useState } from "react";

function App() {
  const initialDucks: Duck[] = [
    { id: 1, name: "Momo", color: "yellow", age: 67 },
    { id: 2, name: "Donald", color: "white", age: 21 },
    { id: 3, name: "Daffy", color: "black", age: 41 },
  ];
  const [ducks, setDucks] = useState<Duck[]>(initialDucks);
  useEffect(() => {
    document.title = `Duck Corp (${ducks.length})`;
    fetches.getDucks().then(setDucks);
  }, ducks);
  return (
    <>
      <Ducks ducks={ducks} setDucks={setDucks} />
    </>
  );
}

export default App;
