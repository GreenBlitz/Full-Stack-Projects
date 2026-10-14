import type { Duck } from "./DuckCard";
import { DuckCard } from "./DuckCard";

interface Ducksprops{
    ducks: Duck[]
}

export function Ducks ({ducks}: Ducksprops) {
    return  <div> {ducks.map((duck) =>(
            <DuckCard key={duck.DuckName} {...duck} /> ) )}
    </div>
}

