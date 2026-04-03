// בס"ד

import { fold, TaskEither } from "fp-ts/lib/TaskEither";
import { EndpointError } from "./verification";
import { Response } from "express";
import { pipe } from "fp-ts/lib/function";
import { StatusCodes } from "http-status-codes";

export const foldResponse =
  (res: Response) =>
  <A extends object>(a: TaskEither<EndpointError, A>) =>
    pipe(
      a,
      fold(
        (error) => () =>
          Promise.resolve(res.status(error.status).send(error.reason)),
        (item) => async () => res.status(StatusCodes.OK).json(item),
      ),
    );
