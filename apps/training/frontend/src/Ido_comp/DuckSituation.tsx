import type { DuckProps } from "./Duck";

export function Duck_Situation(ramdom_duck_list: DuckProps[]) {
  if (ramdom_duck_list.length == 0) {
    return <h2> אין ברווזים😭 </h2>;
  } 
  else if (ramdom_duck_list.length < 6) {
    return <h2> המצב בשליטה👍 </h2>;
  } 
  else {
    return <h2> האתר מוצף בברווזים🚨 </h2>;
  }
}
