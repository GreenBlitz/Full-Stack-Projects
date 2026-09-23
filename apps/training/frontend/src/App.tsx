// בס"ד

import { useState, type FC } from "react";
import { Duck } from "./Ido_comp/Duck";
import { Ducks } from "./Ido_comp/Ducks";
import { MoreDuck } from "./Ido_comp/MoreDuck";

const App: FC = () => {
  const [the_duck_list, set_the_duck_list] = useState([
    { name: "Asaf", colour: "red", age: 250 },
    { name: "Daniel", colour: "blue", age: 18 },
    { name: "Maya", colour: "green", age: 32 },
    { name: "Noam", colour: "yellow", age: 45 },
    { name: "Liam", colour: "purple", age: 27 },
    { name: "Sarah", colour: "orange", age: 63 },
    { name: "Ethan", colour: "black", age: 21 },
    { name: "Ariel", colour: "pink", age: 16 },
    { name: "David", colour: "white", age: 38 },
    { name: "Emma", colour: "cyan", age: 29 },
  ]);
  return (
    <>
      <div style={{ color: "#fc9dff" }}>
        <Duck name="Zib" colour="white" age={6} />
      </div>
      <br />
      <div style={{ color: "#fc9dff" }}>
        <Ducks ducks={the_duck_list} />
      </div>
      <br />
      <button
        style={{ background: "#185372", color: "#fc9dff" }}
        type="button"
        onClick={() => set_the_duck_list(the_duck_list.slice(0, -1))}
      >
        del duck WIwi
      </button>
      <button
        style={{ background: "#185372", color: "#fc9dff" }}
        type="button"
        onClick={() => set_the_duck_list(the_duck_list.slice(0, -1))}
      >
        lamore duck WIwi
      </button>
      <MoreDuck />
    </>
  );
};

export default App;
