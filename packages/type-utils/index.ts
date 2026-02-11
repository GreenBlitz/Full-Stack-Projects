// בס"ד
import { constFalse, constTrue, flow, identity } from "fp-ts/lib/function";
import { type Either, getOrElse, orElse } from "fp-ts/lib/Either";
import type { Refinement } from "fp-ts/lib/Refinement";
import { left, right } from "fp-ts/lib/Either";
import { mapObject } from "@repo/array-functions";

export const isObject = (value: unknown): value is object =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isStringedNumber = (value: unknown): value is `${number}` =>
  typeof value === "string" && !isNaN(Number(value)) && value !== "";

const createTypeGuard = <E, A extends E, B>(
  refinement: Refinement<E, A>,
  onTrue: (item: A) => B,
): (<C>(ma: Either<E, B | C>) => Either<E, B | C>) =>
  orElse((item: E) => (refinement(item) ? right(onTrue(item)) : left(item)));

type CastedItem = object | number | string | boolean | CastedItem[];
export const castItem: (item: unknown) => CastedItem = flow(
  left,
  
  createTypeGuard(isObject, (obj) => mapObject(obj, castItem)),
  createTypeGuard(Array.isArray, (item) => item.map(castItem)),
  createTypeGuard(isStringedNumber, Number),
  createTypeGuard((item) => item === "true", constTrue),
  createTypeGuard((item) => item === "false", constFalse),
  createTypeGuard((item) => typeof item === "string", identity),

  getOrElse<unknown,CastedItem>(() => ""),
);
