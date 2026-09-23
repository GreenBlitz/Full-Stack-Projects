import type { Dispatch, SetStateAction } from "react";
import type { Duck } from "./DuckCard";

interface RemoveLastDuckProps {
    ducks: Duck[];
    setDucks: Dispatch<SetStateAction<Duck[]>>;
}

export function RemoveLastDuck({ ducks, setDucks }: RemoveLastDuckProps) {
    function removeLastDuck() {
        setDucks((currentDucks) => currentDucks.slice(0, -1));
    }

    return (
        <button onClick={removeLastDuck} disabled={ducks.length === 0}>
            Remove last duck
        </button>
    );
}