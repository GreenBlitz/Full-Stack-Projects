// בס"ד

import { useState, type FC } from "react";
import { Duck } from "./Ido_comp/Duck";
import { Ducks } from "./Ido_comp/Ducks";
import { MoreDuck } from "./Ido_comp/MoreDuck";
import { Duck_Situation } from "./Ido_comp/DuckSituation";

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
      <div
        style={{
          color: "#9df0ff",
          border: "2px solid #741477",
          borderRadius: "50px",
          padding: "12px",
          marginBottom: "50px",
        }}
      >
        <h1>The Ducks</h1>
      </div>

      <div
        style={{
          color: "#fc9dff",
          border: "2px solid #741477",
          borderRadius: "50px",
          padding: "20px",
          marginBottom: "16px",
        }}
      >
        <Ducks ducks={the_duck_list} />
      </div>

      <button
        style={{
          background: "#185372",
          color: "#fc9dff",
          border: "2px solid #fc9dff",
          borderRadius: "50px",
          padding: "8px 16px",
          cursor: "pointer",
          marginBottom: "16px",
        }}
        type="button"
        onClick={() => set_the_duck_list(the_duck_list.slice(0, -1))}
      >
        del duck WIwi
      </button>

      <MoreDuck
        the_duck_list={the_duck_list}
        set_the_duck_list={set_the_duck_list}
      />
      <Duck_Situation {...the_duck_list} />
    </>
  );
};

export default App;
