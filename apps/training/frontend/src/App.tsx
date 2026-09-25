// בס"ד
import { useState, type FC, type SetStateAction } from "react";
import { type DuckCardProps } from "./components/DuckCard";
import { Duck } from "./components/Ducks";
import { DuckMessage } from "./components/DuckMessage";
import { DuckFilterInput } from "./components/DuckFilterInput";
const initialDucks: DuckCardProps[] = [
  { name: "Avi", color: "red", age: 4 },
  { name: "Moshe", color: "blue", age: 12 },
  { name: "Haim", color: "yellow", age: 9 },
  { name: "Karni", color: "green", age: 17 },
];

const App: FC = () => {
  const [ducks, setDucks] = useState(initialDucks);
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [age, setAge] = useState(0);
  const [filter, setFilter] = useState("");

  const handleNameChange = (name: { target: { value: string } }) => {
    setName(name.target.value);
  };
  const handleColorChange = (color: { target: { value: string } }) => {
    setColor(color.target.value);
  };
  const handleAgeChange = (age: { target: { value: string } }) => {
    setAge(Number(age.target.value));
  };
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (name === "" || color === "") {
      alert("you cannot submit a duck without a name or a color");
      return;
    }
    setDucks((prev) => prev.concat({ name, color, age }));
    setName("");
    setColor("");
    setAge(0);
  };

  return (
    <>
      <DuckMessage ducksNumber={ducks.length} />
      <DuckFilterInput setFilter={setFilter} />
      <Duck ducks={ducks.filter((duck) => duck.name.includes(filter))} />
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Duck's name</label>
        <input value={name} id="name" onChange={handleNameChange} type="text" />
        <label htmlFor="color">Duck's color</label>
        <input
          value={color}
          id="color"
          onChange={handleColorChange}
          type="text"
        />
        <label htmlFor="age">Duck's age</label>
        <input value={age} id="age" onChange={handleAgeChange} type="number" />
        <button type="submit">Submit</button>
      </form>
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
