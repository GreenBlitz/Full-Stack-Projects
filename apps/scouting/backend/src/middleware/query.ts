// בס"ד

import { flow, pipe } from "fp-ts/lib/function";

const flattenToDotNotation = (obj: object, prefix = ""): object => {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? prefix + "." : "";
    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      Object.assign(acc, flattenToDotNotation(obj[key], pre + key));
    } else {
      acc[pre + key] = obj[key];
    }
    return acc;
  }, {});
};

const castQuery = (query: object): object =>
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
            : value === "true"
              ? true
              : value === "false"
                ? false
                : value,
      ]),
    Object.fromEntries,
  );

export const mongofyQuery = flow(castQuery, flattenToDotNotation);
