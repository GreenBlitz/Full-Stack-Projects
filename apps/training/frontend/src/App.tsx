// בס"ד
import { useState, type FC } from "react";
import { Ducks1 } from "./assets/Ducks1";

const counterStartingValue = 0;
const countIncrement = 1;
const maxCountingValue = 5;
const importantMessage = "MI BOMBO";
const App: FC = () => {
  const [ducks2, setducks] = useState([
    { name: "Karni ", color: " yellow ", age: 3 },
    { name: " Kitty ", color: " yellow ", age: 4 },
    { name: " shalom", color: " yellow", age: 7 },
    { name: " cutie ", color: " yellow ", age: 5 },
  ]);
  const [count, setCount] = useState<string | number>(counterStartingValue);

  return (
    <>
      <Ducks1 ducks={ducks2} />
      <button onClick={() => setducks((ducks) => ducks.slice(0, -1))}>
        erase last duck
      </button>
    </>
  );
};

export default App;
