import axios from "axios";
import { useState } from "react";

function App() {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [age, setAge] = useState<number>(-1);

  const [duck, setDuck] = useState("No duck was sent");

  interface DuckProps {
    name: string;
    color: string;
    age: number;
  }

  function sendDuck(duck: DuckProps) {
    axios
      .post("http://localhost:3001/ducks", duck)
      .then((response) => setDuck(JSON.stringify(response.data)));
  }

  return (
    <>
      <form>
        <label>Name:</label>
        <br />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <br />
        <label>Color:</label>
        <br />
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
        />
        <br />
        <br />
        <label>Age:</label>
        <br />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          required
        />
        <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            sendDuck({ name: name, color: color, age: age });
          }}
        >
          Add Duck
        </button>
      </form>
      <div>{duck}</div>
    </>
  );
}

export default App;
