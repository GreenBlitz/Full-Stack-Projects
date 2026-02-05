// בס"ד
import * as t from "io-ts";

export const forecastProps = t.type({
  redAlliance: t.tuple([t.number, t.number, t.number]),
  blueAlliance: t.tuple([t.number, t.number, t.number]),
});
