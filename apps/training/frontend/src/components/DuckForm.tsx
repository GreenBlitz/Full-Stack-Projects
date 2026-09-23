import {
  useState,
  type Dispatch,
  type SetStateAction,
  type SyntheticEvent,
} from "react";
import { createPortal } from "react-dom";
import type { DucksProps } from "./Ducks";
import type { DuckProps } from "./Duck";

export interface DuckFormProps {
  ducks: DuckProps[];
  setDucks: Dispatch<
    SetStateAction<
      {
        name: string;
        color: string;
        age: number;
      }[]
    >
  >;
}

export function DuckForm({ ducks, setDucks }: DuckFormProps) {
  const [inputs, setInputs] = useState({
    duckName: "",
    duckColor: "",
    duckAge: -1,
  });

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newDucks = ducks.map((duck) => duck);
    newDucks.push({
      name: inputs.duckName,
      color: inputs.duckColor,
      age: inputs.duckAge,
    });
    setDucks(newDucks);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Name: </label>
        <input
          name="duckName"
          type="text"
          value={inputs.duckName}
          onChange={handleChange}
          required
        />
        <br />
        <label>Color: </label>
        <input
          name="duckColor"
          type="text"
          value={inputs.duckColor}
          onChange={handleChange}
          required
        />
        <br />
        <label>Age: </label>
        <input
          name="duckAge"
          type="number"
          value={inputs.duckAge}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Add Duck</button>
      </form>
    </>
  );
}
