// בס"ד
import { flow } from "fp-ts/lib/function";
import { type Either, flatMap, fold } from "fp-ts/lib/Either";
import type { Refinement } from "fp-ts/lib/Refinement";
import { left, right } from "fp-ts/lib/Either";
import { mapObject } from "@repo/array-functions";

export const isObject = (value: unknown): value is object =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isStringedNumber = (value: unknown): value is `${number}` =>
  typeof value === "string" && !isNaN(Number(value)) && value !== "";

export const createTypeGuard = <A, B extends A, C>(
  refinement: Refinement<A, B>,
  onTrue: (item: B) => C,
): (<E1>(ma: Either<E1, A>) => Either<C | E1, A>) =>
  flow(
    flatMap((item: A) => (refinement(item) ? left(onTrue(item)) : right(item))),
  );

type CastedItem = object | number | string | boolean | CastedItem[];
export const castItem: (item: unknown) => CastedItem = flow(
  right,
  createTypeGuard(isObject, (obj) => mapObject(obj, castItem)),
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
