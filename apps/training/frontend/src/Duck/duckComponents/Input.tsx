import { useState, type Dispatch, type SetStateAction } from "react";
import type { DuckProps } from "./Duck";

interface InputProps {
  filter: string;
  setFilter: (st: string) => void;
}

export function Input({ filter, setFilter }: InputProps) {
  function handleChange(e) {
    setFilter(e.target.value);
  }

  return (
    <div>
      <form>
        <label>Filter: </label>
        <input type="text" onChange={handleChange} value={filter} />
      </form>
    </div>
  );
}
