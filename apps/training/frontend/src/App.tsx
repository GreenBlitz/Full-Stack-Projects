import axios from "axios";
import { useState } from "react";

function App() {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [age, setAge] = useState<number>();
  const [password, setPassword] = useState<string>("");
  const [nameToUpdate, setNameToUpdate] = useState<string>("");
  const [filteredDucks, setFilteredDucks] = useState("");
  const [ducks, setDucks] = useState("");
  const [duck, setDuck] = useState<string>("No duck was sent/deleted/edited");

  interface DuckProps {
    name: string;
    color: string;
    age: number;
  }

  function sendDuck(duck: DuckProps) {
    axios
      .post("http://localhost:4590/ducks", duck, {
        headers: {
          "duck-password": password,
        },
      })
      .then((response) => setDuck(JSON.stringify(response.data, null, 2)));
  }

  function deleteDuck(name: string) {
    axios
      .delete(`http://localhost:4590/ducks/${name}`, {
        headers: {
          "duck-password": password,
        },
      })
      .then((res) => setDuck(res.data.name + " was deleted!"));
  }

  function updateDuck(name: string, duck: DuckProps) {
    if (name) {
      axios
        .patch(
          `http://localhost:4590/ducks/${name}`,
          { duck: duck },
          {
            headers: {
              "duck-password": password,
            },
          },
        )
        .then((res) => setDuck(res.data + " was updated (updated to this)!"));
    }
  }

  function filterDucks({ name, color, age }: DuckProps) {
    axios
      .get("http://localhost:4590/ducks", {
        params: {
          name: name,
          color: color,
          age: age,
        },
      })
      .then((res) => {
        setFilteredDucks(JSON.stringify(res.data.filteredDucks, null, 2));
        setDucks(JSON.stringify(res.data.ducks, null, 2));
      });
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
        />
        <br />
        <br />
        <label>Color:</label>
        <br />
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <br />
        <br />
        <label>Age:</label>
        <br />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
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
            deleteDuck(name);
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
        <br />
        <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            filterDucks({ name, color, age });
          }}
        >
          Filter ducks
        </button>
        <br />
        <br />
        <label>Password:</label>
        <br />
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </form>
      <div>{duck}</div>
      <div>{filteredDucks}</div>
    </>
  );
}

export default App;
