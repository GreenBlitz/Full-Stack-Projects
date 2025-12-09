// בס"ד
import * as t from "io-ts";
export const simpleAlliance = t.type({
  dq_team_keys: t.array(t.string),
  score: t.number,
  surrogate_team_keys: t.array(t.string),
  team_keys: t.array(t.string),
});
type SimpleAllianceType = typeof simpleAlliance._A;
