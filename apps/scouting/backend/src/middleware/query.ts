// בס"ד

import { flow, pipe } from "fp-ts/lib/function";

const isObject = (value: unknown): value is object =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isStringedNumber = (value: unknown): value is `${number}` =>
  typeof value === "string" && !isNaN(Number(value)) && value !== "";

const flattenToDotNotation = (obj: object, prefix = ""): object => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const pre = prefix.length ? prefix + "." : "";
    if (isObject(value)) {
      Object.assign(acc, flattenToDotNotation(value, pre + key));
    } else {
      acc[pre + key] = value;
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
        (() => {
          if (isObject(value)) {
            return castQuery(value);
          }
          if (isStringedNumber(value)) {
            return Number(value);
          }
          if (value === "true") {
            return true;
          }
          if (value === "false") {
            return false;
          }
          if (typeof value === "string") {
            return value;
          }
          return "";
        })(),
      ]),
    Object.fromEntries,
    (value) => (isObject(value) ? value : {}),
  );

export const mongofyQuery = flow(castQuery, flattenToDotNotation);
