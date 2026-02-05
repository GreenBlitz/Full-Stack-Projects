// בס"ד
import * as t from "io-ts";


export const teamsProps = t.type({
  teams: t.array(t.number),
});