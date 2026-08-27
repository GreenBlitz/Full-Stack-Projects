import * as fetches from "../fetches.ts";
import type { Duck } from "./DuckCard.tsx";
import type { Dispatch, SetStateAction } from "react";

export interface DuckAdderProps {
  setDucks: Dispatch<SetStateAction<Duck[]>>;
}

export function DuckAdder({ setDucks }: DuckAdderProps) {
  const addDuck = (formData: FormData) => {
    const name = (formData.get("name") as string) ?? "";
    const color = (formData.get("color") as string) ?? "";
    const age = Number(formData.get("age") ?? 0);
    fetches.addDuck(name, color, age).then(setDucks);
  };

  return (
    <form action={addDuck}>
      <h2>Create a new duck</h2>

      <label htmlFor={"name"}>Name: </label>
      <input type={"text"} id={"name"} name={"name"} required={true} />
      <br />
      <label htmlFor={"color"}>Color: </label>
      <select id={"color"} name={"color"} required={true}>
        <option>red</option>
        <option>orange</option>
        <option>brown</option>
        <option>yellow</option>
        <option>green</option>
        <option>blue</option>
        <option>purple</option>
        <option>pink</option>
        <option>white</option>
        <option>gray</option>
        <option>white</option>
      </select>
      <br />
      <label htmlFor={"age"}>Age: </label>
      <input type={"number"} id={"age"} name={"age"} required={true} />
      <br />
      <input type={"submit"} value={"Create"} />
    </form>
  );
}
