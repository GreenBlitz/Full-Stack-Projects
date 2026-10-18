import axios from "axios";
import { useState } from "react";

function App() {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [age, setAge] = useState<number>();
  const [nameToUpdate, setNameToUpdate] = useState<string>("");

  const [duck, setDuck] = useState("No duck was sent");

  interface DuckProps {
    name: string;
    color: string;
    age: number;
  }

  function sendDuck(duck: DuckProps) {
    axios
      .post("http://localhost:3001/ducks", duck)
      .then((response) => setDuck(response.data));
  }

  function deleteDuck(duck: DuckProps) {
    axios
      .delete(`http://localhost:3001/ducks/${duck.name}`)
      .then((response) => setDuck(response.data));
  }

  function updateDuck(name: string, duck: DuckProps) {
    if (name) {
      axios
        .patch("http://localhost:3001/ducks/", { name: name, duck: duck })
        .then((res) => setDuck(res.data.duck));
    }
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
        <br />
        <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            deleteDuck({ name: name, color: color, age: age });
          }}
        >
          Delete Duck
        </button>
        <br />
        <br />
        <label>Name to update: </label>
        <br />
        <input
          type="text"
          value={nameToUpdate}
          onChange={(e) => setNameToUpdate(e.target.value)}
        />
        <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            updateDuck(nameToUpdate, { name: name, color: color, age: age });
          }}
        >
          Update duck
        </button>
      </form>
      <div>{duck}</div>
    </>
  );
}

export default App;
