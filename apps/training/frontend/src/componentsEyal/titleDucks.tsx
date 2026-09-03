import type { Duck } from "./DuckCard";
import { useEffect } from "react";

export function HowManyDucks({ ducks }: { ducks: Duck[] }) {
  useEffect(() => {
    document.title = "ducks: (" + ducks.length+")";
  }, []);
  return <p></p>;
}
