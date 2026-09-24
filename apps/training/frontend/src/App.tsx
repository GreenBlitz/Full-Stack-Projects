// בס"ד
import { useState, type FC } from "react";
import { DuckCard, type DuckCardProps } from "./components/DuckCard";
import { Duck } from "./components/Ducks";
const initialDucks: DuckCardProps[] = [
  { name: "Avi", color: "red", age: 4 },
  { name: "Moshe", color: "blue", age: 12 },
  { name: "Haim", color: "yellow", age: 9 },
  { name: "Karni", color: "green", age: 17 },
];

const App: FC = () => {
  const [ducks, setDucks] = useState(initialDucks);
  return (
    <>
      <Duck ducks={ducks} />
      <br />
      <button
        className="remove-duck"
        type="button"
        onClick={() => setDucks((prev) => prev.slice(0, -1))}
      >
        Remove a duck
      </button>
    </>
  );
};

export default App;
