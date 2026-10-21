import type { Duck } from "./DuckCard";

type SortDucksProps = {
  setducks: React.Dispatch<React.SetStateAction<Duck[]>>;
};

export function SortDucks({ setducks }: SortDucksProps) {
  const sortByName = () => {
    setducks((ducks) =>
      [...ducks].sort((a, b) =>
        a.name.trim().localeCompare(b.name.trim(), "he"),
      ),
    );
  };

  const sortByColor = () => {
    setducks((ducks) =>
      [...ducks].sort((a, b) =>
        a.color.trim().localeCompare(b.color.trim(), "he"),
      ),
    );
  };

  const sortByAge = () => {
    setducks((ducks) => [...ducks].sort((a, b) => a.age - b.age));
  };

  return (
    <div>
      <button onClick={sortByName}>מיין לפי שם</button>
      <button onClick={sortByColor}>מיין לפי צבע</button>
      <button onClick={sortByAge}>מיין לפי גיל</button>
    </div>
  );
}
