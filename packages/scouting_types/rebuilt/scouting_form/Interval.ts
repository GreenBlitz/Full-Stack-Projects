// בס"ד
import * as t from "io-ts";

export const intervalCodec = t.type({ start: t.number, end: t.number });
export type Interval = t.TypeOf<typeof intervalCodec>
