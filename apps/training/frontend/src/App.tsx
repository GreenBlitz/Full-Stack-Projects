import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Duck, type DuckProps } from "./components/Duck";
import { Ducks, type DucksProps } from "./components/Ducks";
import { DuckForm } from "./components/DuckForm";
import { Input } from "./components/Input";

// בס"ד
function App() {
  const [ducks, setDucks] = useLocalStorage("ducks-key", [
    { name: "Henry", color: "white", age: 15 },
    { name: "Nahum", color: "black", age: 14 },
    { name: "Zib", color: "yellow", age: 46 },
    { name: "Maor", color: "magenta", age: 16 },
  ]);

  const [filter, setFilter] = useState("");

  const visibleDucks = ducks.filter((duck: DuckProps) =>
    duck.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <>
      {(document.title = `Ducks (${ducks.length})`)}
      <div>
        <button
          onClick={() =>
            setDucks(
              [...ducks].sort((a, b) => {
                return a.name.localeCompare(b.name);
              }),
            )
          }
        >
          By Name
        </button>
        <button
          onClick={() =>
            setDucks(
              [...ducks].sort((a, b) => {
                return a.color.localeCompare(b.color);
              }),
            )
          }
        >
          By Color
        </button>
        <button
          onClick={() =>
            setDucks(
              [...ducks].sort((a, b) => {
                return a.age - b.age;
              }),
            )
          }
        >
          By Age
        </button>
      </div>
      <br />
      <Ducks ducks={visibleDucks} />
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
      <Input filter={filter} setFilter={setFilter} />
    </>
  );
}

export default App;
