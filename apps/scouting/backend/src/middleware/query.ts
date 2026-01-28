// בס"ד

import { pipe } from "fp-ts/lib/function";

export const castQuery = (query: object): object =>
  pipe(
    query,
    Object.entries,
    (entries) =>
      entries.map(([key, value]) => [
        key,
        value && typeof value === "object"
          ? castQuery(value)
          : typeof value === "string" && !isNaN(Number(value)) && value !== ""
            ? Number(value)
            : value,
      ]),
    Object.fromEntries,
  );
