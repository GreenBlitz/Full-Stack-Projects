// בס"ד

import { flow, pipe } from "fp-ts/lib/function";
import { map as mapTask } from "fp-ts/lib/Task";
import {
  flatMap,
  fold,
  tryCatch,
  right,
  TaskEither,
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
    mapTask((item) => rightEither(item)),
  );
