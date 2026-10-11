import type { DuckProps } from "./Duck";

interface random_duck_props{
  random_duck_list: DuckProps[]
}

export function DuckSituation({random_duck_list}: random_duck_props) {
  if (random_duck_list.length == 0) {
    return <h2> אין ברווזים😭 </h2>;
  } 
  else if (random_duck_list.length < 6) {
    return <h2> המצב בשליטה👍 </h2>;
  } 
  else {
    return <h2> האתר מוצף בברווזים🚨 </h2>;
  }
}
