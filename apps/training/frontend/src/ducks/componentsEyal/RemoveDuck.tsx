import type { Dispatch, SetStateAction } from "react";
import type { Duck } from "./DuckCard";
import axios from "axios";

interface RemoveLastDuckProps {
  ducks: Duck[];
  setDucks: Dispatch<SetStateAction<Duck[]>>;
}

async function deleteDucktemp(DuckToDelete: string) {
  const temp = "http://localhost:4590/ducks/" + DuckToDelete;
  const response = await axios.delete(temp);
  console.log(response.data);
}

export function RemoveLastDuck({ ducks, setDucks }: RemoveLastDuckProps) {
  async function removeLastDuck() {
    const lastDuck = ducks[ducks.length - 1];
    if (!lastDuck) return;

    try {
      await deleteDucktemp(lastDuck.DuckName);
      setDucks((currentDucks) => currentDucks.slice(0, -1));
    } catch (error) {
      console.error("Could not delete duck:", error);
    }
    deleteDucktemp(ducks[ducks.length - 1].DuckName);
    setDucks;
  }

  return (
    <button onClick={removeLastDuck} disabled={ducks.length === 0}>
      Remove last duck
    </button>
  );
}
