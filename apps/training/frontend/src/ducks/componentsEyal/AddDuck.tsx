import type { FormEvent } from "react";
import type { Duck } from "./DuckCard";
import axios from "axios";

type AddDuckProps = {
  onAddDuck: (duck: Duck) => void;
};

export function AddDuck({ onAddDuck }: AddDuckProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const duck: Duck = {
      DuckName: String(formData.get("name")),
      DuckColor: String(formData.get("color")),
      DuckAge: Number(formData.get("age")),
    };

    try {
      await axios.post("http://localhost:3001/ducks", {
        name: duck.DuckName,
        color: duck.DuckColor,
        age: duck.DuckAge,
      });
      onAddDuck(duck);
      form.reset();
    } catch (error) {
      console.error("Could not add duck:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        style={{
          background: "lightgray",
          border: "1px solid #1d0808",
          padding: "10px",
        }}
        name="name"
        placeholder="Duck name"
      />
      <input
        style={{
          background: "lightgray",
          border: "1px solid #1d0808",
          padding: "10px",
        }}
        name="color"
        placeholder="Duck color"
      />
      <input
        style={{
          background: "lightgray",
          border: "1px solid #1d0808",
          padding: "10px",
        }}
        name="age"
        type="number"
        placeholder="Duck age"
      />
      <button type="submit">Add duck</button>
    </form>
  );
}
