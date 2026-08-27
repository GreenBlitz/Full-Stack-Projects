import type { Duck } from "./DuckCard";

interface Ducksprops{
    ducks: Duck[]
}

export function Ducks ({ducks}: Ducksprops) {
    return  <span>{ducks.map((duck) =>(<div key={duck.DuckName}> {duck.DuckName}</div>) )}</span>
}

