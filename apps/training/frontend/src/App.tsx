import { useState } from "react";
import { Duck, type DuckProps } from "./components/Duck";
import { Ducks, type DucksProps } from "./components/Ducks";

// בס"ד
function deleteFinalDuck({ ducks: initialDucks }: DucksProps) {
  const [deleteFinal, setDeleteFinal] = useState(initialDucks);
  setDeleteFinal((prevDeleteFinal) => prevDeleteFinal.slice(0, -1));
}

function App() {
  let ducks = [
    { name: "Henry", color: "white", age: 15 },
    { name: "Nahum", color: "black", age: 14 },
    { name: "Zib", color: "yellow", age: 46 },
    { name: "Maor", color: "magenta", age: 16 },
  ];
  return (
    <>
      <Ducks ducks={ducks} />
      <button type="button" onClick={() => setDelete}
    </>
  );
}

export default App;
