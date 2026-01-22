// בס"ד
import * as t from "io-ts";

export const intervalCodec = t.type({ start: t.number, end: t.number });
export const maxInterval: t.TypeOf<typeof intervalCodec> = {
    start: 0,
    end: 255
};
export type Interval = t.TypeOf<typeof intervalCodec>
