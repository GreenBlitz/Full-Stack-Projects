// בס"ד

import { castItem, isObject } from "@repo/type-utils";
import { flow } from "fp-ts/lib/function";

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

export const mongofyQuery = flow(
  castItem,
  (item) => (isObject(item) ? item : {}),
  flattenToDotNotation,
);
