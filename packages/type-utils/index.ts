// בס"ד
import { constFalse, constTrue, flow, identity } from "fp-ts/lib/function";
import {
  type Either,
  flatMap,
  getOrElse,
  left,
  mapLeft,
  orElse,
  right,
} from "fp-ts/lib/Either";
import type { Refinement } from "fp-ts/lib/Refinement";
import { mapObject } from "@repo/array-functions";
import { Type } from "io-ts";
import { failure } from "io-ts/lib/PathReporter";

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

  getOrElse<unknown, CastedItem>(() => ""),
);

export const createTypeCheckingEndpointFlow = <E, U>(
  typeToCheck: Type<U, unknown>,
  onFail: (error: string) => E,
) =>
  flatMap(
    flow(
      typeToCheck.decode,
      mapLeft((errors) => onFail(failure(errors).join("\n"))),
    ),
  );

type DeepPartial<T> = T extends Date
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export function filter<T>(filtered: NonNullable<T>, filterBy: DeepPartial<T>) {
  if (!filterBy) {
    return true;
  }
  if (filterBy instanceof Date && filtered instanceof Date) {
    return filterBy.getTime() === filtered.getTime();
  }
  if (typeof filterBy === "object" && typeof filtered === "object") {
    Object.keys(filterBy).every((key) => {
      return filter(filtered[key], filterBy[key]);
    });
  }
  return filterBy === filtered;
}
