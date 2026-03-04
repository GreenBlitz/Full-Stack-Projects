// בס"ד

import { flatMap, tryCatch } from "fp-ts/lib/TaskEither";

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
