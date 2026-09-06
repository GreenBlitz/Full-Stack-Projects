import type { Duck } from "./DuckCard";

export function CountDuck({ ducks }: { ducks: Duck[] }) {
  if (ducks.length <= 0) {
    return <p style={{ color: 'red' }}> there are no ducks "crying emoji"</p>;
  }
  if (ducks.length >= 6) {
    return <p style={{ color: 'red' }}> there are too many ducks "alarm emoji" </p>;
  }
  return <p style={{ color: 'green' }}> there are an expected amount of ducks "thumbs up emoji" </p>;
}
