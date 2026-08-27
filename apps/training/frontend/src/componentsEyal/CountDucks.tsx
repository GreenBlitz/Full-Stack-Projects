import type { Duck } from "./DuckCard";

export function CountDuck({ ducks }: { ducks: Duck[] }) {
  if (ducks.length <= 0) {
    return <p> there are no ducks "crying emoji"</p>;
  }
  if (ducks.length >= 6) {
    return <p> there are too many ducks "alarm emoji" </p>;
  }
  return <p> there are an exptable amount of ducks "thumbs upp emoji" </p>;
}
