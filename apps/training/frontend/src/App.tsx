import * as fetches from "./fetches.ts";
import { Ducks } from "./ducks/Ducks.tsx";
import type { Duck } from "./ducks/DuckCard.tsx";
import { useEffect, useState } from "react";

function App() {
  const [ducks, setDucks] = useState<Duck[]>([]);
  useEffect(() => {
    document.title = `Duck Corp (${ducks.length})`;
  }, ducks);
  useEffect(() => {
    fetches.getDucks().then(setDucks);
  }, []);
  return (
    <>
      <Ducks ducks={ducks} setDucks={setDucks} />
    </>
  );
}

export default App;
