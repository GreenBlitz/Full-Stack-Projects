import type { FormEvent } from "react";
import type { Duck } from "./DuckCard";

type AddDuckProps = {
  onAddDuck: (duck: Duck) => void;
};

export function AddDuck({ onAddDuck }: AddDuckProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const duck: Duck = {
      DuckName: String(formData.get("name")),
      DuckColor: String(formData.get("color")),
      DuckAge: Number(formData.get("age")),
    };

    onAddDuck(duck);
    event.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input style={{background:"lightgray", border:"1px solid #1d0808", padding:"10px"}} name="name" placeholder="Duck name" />
      <input style={{background:"lightgray", border:"1px solid #1d0808", padding:"10px"}} name="color" placeholder="Duck color" />
      <input style={{background:"lightgray", border:"1px solid #1d0808", padding:"10px"}} name="age" type="number" placeholder="Duck age" />
      <button type="submit">Add duck</button>
    </form>
  );
}
