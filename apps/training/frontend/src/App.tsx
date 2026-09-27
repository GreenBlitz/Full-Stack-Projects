import { useEffect, useState } from "react";
import { Duck, type DuckProps } from "./components/Duck";
import { Ducks, type DucksProps } from "./components/Ducks";
import { DuckForm } from "./components/DuckForm";

// בס"ד
function App() {
  const [ducks, setDucks] = useState([
    { name: "Henry", color: "white", age: 15 },
    { name: "Nahum", color: "black", age: 14 },
    { name: "Zib", color: "yellow", age: 46 },
    { name: "Maor", color: "magenta", age: 16 },
  ]);
  return (
    <>
      {(document.title = `Ducks (${ducks.length})`)}
      <Ducks ducks={ducks} />
      <button type="button" onClick={() => setDucks(ducks.slice(0, -1))}>
        Delete Duck
      </button>
      <DuckForm ducks={ducks} setDucks={setDucks} />
      <div>
        {ducks.length == 0
          ? "אין ברווזים😭"
          : ducks.length > 0 && ducks.length < 6
            ? "המצב בשליטה👍"
            : "האתר מוצף בברווזים🚨"}
      </div>
    </>
  );
}

export default App;
