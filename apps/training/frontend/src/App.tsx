import { Ducks } from "./ducks/Ducks.tsx";
import type { Duck } from "./ducks/DuckCard.tsx";
import { useEffect, useState } from "react";

function App() {
  const initialDucks: Duck[] = [
    { name: "Momo", color: "yellow", age: 67 },
    { name: "Donald", color: "white", age: 21 },
    { name: "Daffy", color: "black", age: 41 },
  ];
  const [ducks, setDucks] = useState<Duck[]>(
    JSON.parse(localStorage.getItem("ducks") ?? JSON.stringify(initialDucks)),
  );
  useEffect(() => {
    document.title = `Duck Corp (${ducks.length})`;
    localStorage.setItem("ducks", JSON.stringify(ducks));
  }, [ducks]);
  return (
    <>
      <Ducks ducks={ducks} setDucks={setDucks} />
    </>
  );
}

export default App;
