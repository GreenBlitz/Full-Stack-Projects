import type { Duck } from "./DuckCard";

interface Ducksprops{
    ducks: Duck[]
}

export function Ducks ({ducks}: Ducksprops) {
    return  <span> {ducks.map((duck) =>(
            <div key={duck.DuckName} style={{ color: duck.DuckColor }}> {duck.DuckAge}, {duck.DuckName}</div> ) )}
    </span>
}

