// בס"ד
import * as t from "io-ts";

export const allianceCodec = t.keyof({
  red: null,
  blue: null,
});

export type Alliance = t.TypeOf<typeof allianceCodec>;
