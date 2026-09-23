import type { Duck } from "./DuckCard";
import { Ducks } from "./Ducks";

export function CountDuckByColor({ ducks, color }: { ducks: Duck[]; color: string }) {
  return <Ducks ducks={ducks.filter((duck) => duck.DuckColor === color)} />;
}
