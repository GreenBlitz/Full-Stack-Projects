import { useState } from "react";
import { Duck, type DuckProps } from "./Duck";

function makeDuck(name: string, color: string, age: number) {
  return Duck({ name, color, age });
}

export function DuckForm() {
  const [inputs, setInputs] = useState({});

  function handleChange(e: any) {
    const name=e.target.name;
    const value=e.target.value;

    setInputs(values => ({...values, [name]: value}))
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    makeDuck({inputs.name, inputs.color, inputs.age});
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Name: </label>
      <input
        name="name"
        id="name"
        type="text"
        value={inputs.name}
        onChange={handleChange}
        required
      />
      <br />
      <label>Color: </label>
      <input
        name="color"
        id="color"
        type="text"
        value={inputs.color}
        onChange={handleChange}
        required
      />
      <br />
      <label>Age: </label>
      <input
        name="age"
        id="age"
        type="number"
        value={inputs.age}
        onChange={handleChange}
        required
      />
      <br />
      <button type="submit">Add Duck</button>
    </form>
  );
}
