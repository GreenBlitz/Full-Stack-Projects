// בס"ד
import { useEffect, useState, type FC } from "react";
import { Ducks1 } from "./assets/Ducks1";
import type { Duck } from "./DuckCard";
import { Addduck } from "./Addduck";
import { SortDucks } from "./colornameage";

const counterStartingValue = 0;
const countIncrement = 1;
const maxCountingValue = 5;
const importantMessage = "MI BOMBO";

const App: FC = () => {
  const [ducks2, setducks] = useState<Duck[]>(() => {
    const savedDucks = localStorage.getItem("ducks");

    if (savedDucks !== null) {
      return JSON.parse(savedDucks) as Duck[];
    }

    return [
      { name: "Karni ", color: " yellow ", age: 3 },
      { name: " Kitty ", color: " yellow ", age: 4 },
      { name: " shalom", color: " yellow", age: 7 },
      { name: " cutie ", color: " yellow ", age: 5 },
    ];
  });
  useEffect(() => {
    localStorage.setItem("ducks", JSON.stringify(ducks2));
  }, [ducks2]);
  const [searchName, setSearchName] = useState("");

  const filteredDucks = ducks2.filter((duck) =>
    duck.name.trim().startsWith(searchName.trim()),
  );

  useEffect(() => {
    document.title = `Number of ducks: {ducks2.length}`;
  }, [ducks2]);

  return (
    <div>
      <SortDucks setducks={setducks} />

      <Addduck setducks={setducks} />
      <Ducks1 ducks={ducks2} />
      <button onClick={() => setducks((ducks) => ducks.slice(0, -1))}>
        erase last duck
      </button>
      {ducks2.map((duck, index) => (
        <p key={index}>
          {duck.name} {duck.color} {duck.age}
        </p>
      ))}
      <div>
        <label>Search a duck </label>
        <input
          type="text"
          value={searchName}
          onChange={(event) => setSearchName(event.target.value)}
          placeholder="type a duck name"
        />
        {searchName.trim() !== "" && (
          <ul>
            {filteredDucks.map((duck, index) => (
              <li key={index}>{duck.name.trim()}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default App;
// const [ducks2, setducks] = useState<Duck[]>(() => {
//   const savedDucks = localStorage.getItem("ducks");

//   if (savedDucks !== null) {
//     return JSON.parse(savedDucks) as Duck[];
//   }

//   return [
//     { name: "Karni ", color: " yellow ", age: 3 },
//     { name: " Kitty ", color: " yellow ", age: 4 },
//     { name: " shalom", color: " yellow", age: 7 },
//     { name: " cutie ", color: " yellow ", age: 5 },
//   ];
// });
