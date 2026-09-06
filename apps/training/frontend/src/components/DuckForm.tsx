import { Duck, type DuckProps } from "./Duck";

function makeDuckProps({ name, color, age }: DuckProps): DuckProps {
  return { name, color, age };
}
export function DuckForm() {
  return (
    <form>
      <label>Name: </label>
      <input name="name" id="name" type="text" value="" required />
      <br />
      <label>Color: </label>
      <input name="color" id="color" type="text" value="" required />
      <br />
      <label>Age: </label>
      <input name="age" id="age" type="number" value={-1} required />
      <br />
      <button type="submit">Add Duck</button>
    </form>
  );
}
