// בס"ד

import { flow, pipe } from "fp-ts/lib/function";
import { map as mapTask } from "fp-ts/lib/Task";
import {
  flatMap,
  fold,
  tryCatch,
  right,
  TaskEither,
  map,
  mapBoth,
} from "fp-ts/lib/TaskEither";
import { right as rightEither } from "fp-ts/lib/Either";

export const flatTryCatch = <A, E2, B>(
  f: (a: A) => Promise<B>,
  onRejected: (reason: unknown, a: A) => E2,
) =>
  flatMap<A, E2, B>((a) =>
    tryCatch(
      () => f(a),
      (reason) => onRejected(reason, a),
    ),
  );

export const toUnion = <E, A, B>(
  defaultValue: B,
): ((ma: TaskEither<E, A>) => TaskEither<never, A | B>) =>
  flow(
    fold<E, A, A | B>(
      () => () => Promise.resolve(defaultValue),
      (item) => () => Promise.resolve(item),
    ),
    mapTask(rightEither),
  );

export const tap = <A>(fn: (a: A) => void) =>
  map<A, A>((a) => {
    fn(a);
    return a;
  });

export const createLog = <E, A>(
  rightTransformation?: (a: A) => unknown,
  leftTransformation?: (e: E) => unknown,
) =>
  mapBoth<E, E, A, A>(
    (e) => {
      const item = leftTransformation ? leftTransformation(e) : e;
      console.log("LEFT = ", item);
      return e;
    },
    (a) => {
      const item = rightTransformation ? rightTransformation(a) : a;
      console.log("RIGHT = ", item);
      return a;
    },
  );
