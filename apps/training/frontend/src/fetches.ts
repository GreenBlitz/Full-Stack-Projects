import axios from "axios";
import type { Duck } from "./ducks/DuckCard.tsx";

export async function getDucks(nameQuery: string = ""): Promise<Duck[]> {
  const response = await axios.get<Duck[]>(
    "http://localhost:8000/ducks?name=" + nameQuery,
  );
  return response.data;
}

export async function deleteDuck(id: number): Promise<Duck[]> {
  const response = await axios.delete("http://localhost:8000/ducks/" + id);
  return response.data;
}

export async function addDuck(
  name: string,
  color: string,
  age: number,
): Promise<Duck[]> {
  const response = await axios.post(
    "http://localhost:8000/ducks",
    `{ \"name\": \"${name}\", \"color\": \"${color}\", \"age\": ${age} }`,
  );
  return response.data;
}
