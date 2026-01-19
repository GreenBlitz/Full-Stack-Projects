// בס"ד
import * as t from "io-ts";

export const movementCodec = t.type({
  trenchPass: t.boolean,
  bumpPass: t.boolean,
  bumpStuck: t.boolean,
});
export const defaultMovement: t.TypeOf<typeof movementCodec> = {
  trenchPass: false,
  bumpPass: false,
  bumpStuck: false,
};
