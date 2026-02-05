// בס"ד

import { flatMap, fold, left, right } from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import type { Refinement } from "fp-ts/lib/Refinement";

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

const createTypeGuard = <A, B extends A, C>(
  refinement: Refinement<A, B>,
  onTrue: (item: B) => C,
) =>
  flow(
    flatMap((item: A) => (refinement(item) ? left(onTrue(item)) : right(item))),
  );

type CastedItem = object | number | string | boolean | CastedItem[];
export const castItem: (item: unknown) => CastedItem = flow(
  right,
  createTypeGuard(
    isObject,
    flow(
      Object.entries,
      (entries) => entries.map(([key, value]) => [key, castItem(value)]),
      (entries) => Object.fromEntries(entries) as object,
    ),
  ),
  createTypeGuard(Array.isArray, (item) => item.map(castItem)),
  createTypeGuard(isStringedNumber, Number),
  createTypeGuard(
    (item) => item === "true",
    () => true,
  ),
  createTypeGuard(
    (item) => item === "false",
    () => false,
  ),
  createTypeGuard(
    (item) => typeof item === "string",
    (item) => item,
  ),

  fold(
    (item) => item,
    () => "",
  ),
);

export const mongofyQuery = flow(
  castItem,
  (item) => (isObject(item) ? item : {}),
  flattenToDotNotation,
);
