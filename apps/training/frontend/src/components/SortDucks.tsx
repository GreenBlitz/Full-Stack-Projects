import type { DuckCardProps } from "./DuckCard";
import { useState, type Dispatch, type SetStateAction } from "react";

export type SortKey = "name" | "color" | "age" | "";
type SortableKey = Exclude<SortKey, "">;

export interface SortDucksProps {
  ducks: DuckCardProps[];
  sortKey: SortKey;
  setDucks: Dispatch<SetStateAction<DuckCardProps[]>>;
  setSortKey: Dispatch<SetStateAction<SortKey>>;
}

export function SortDucks({
  ducks,
  sortKey,
  setDucks,
  setSortKey,
}: SortDucksProps) {
  const [direction, setDirection] = useState<1 | -1>(1);

  const sortDirectionHandler = (nextSortKey: SortableKey) => {
    const nextDirection: 1 | -1 =
      sortKey === nextSortKey ? (direction === 1 ? -1 : 1) : 1;

    setDirection(nextDirection);
    setSortKey(nextSortKey);

    const sorted = [...ducks].sort((a, b) => {
      const comparison =
        nextSortKey === "age"
          ? a.age - b.age
          : a[nextSortKey].localeCompare(b[nextSortKey]);

      return comparison * nextDirection;
    });

    setDucks(sorted);
  };

  return (
    <>
      <button type="button" onClick={() => sortDirectionHandler("age")}>
        Sort by age
      </button>
      <button type="button" onClick={() => sortDirectionHandler("name")}>
        Sort by name
      </button>
      <button type="button" onClick={() => sortDirectionHandler("color")}>
        Sort by color
      </button>
    </>
  );
}
