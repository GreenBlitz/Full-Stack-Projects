import axios from "axios";
import type { Duck } from "./ducks/DuckCard.tsx";

export async function getDucks(): Promise<Duck[]> {
  const response = await axios.get<Duck[]>("localhost:3000/ducks");
  return response.data;
}

export async function deleteDuck(id: number): Promise<Duck[]> {
  const response = await axios.delete("localhost:3000/ducks/" + id);
  return response.data;
}

export async function addDuck(
  name: string,
  color: string,
  age: number,
): Promise<Duck[]> {
  const response = await axios.post(
    "localhost:3000/ducks",
    `{ name: \"${name}\", color: \"${color}\", age: ${age} }`,
  );
  return response.data;
}
