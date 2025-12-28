// בס"ד
import * as t from "io-ts";

export const matchesProps = t.type({
  event: t.string,
});

export type MatchesProps = t.Type<typeof matchesProps>;