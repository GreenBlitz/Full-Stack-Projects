// בס"ד
import type { Request } from "express";
import { flatMap, type Either, map, mapLeft } from "fp-ts/lib/Either";
import { StatusCodes } from "http-status-codes";
import { failure } from "io-ts/lib/PathReporter";
import { flow, pipe } from "fp-ts/lib/function";
import type { Type } from "io-ts";

export interface EndpointError {
  status: number;
  reason: string;
}

export const createTypeCheckingFlow = <E extends EndpointError, U>(
  typeToCheck: Type<U, unknown>,
  onFail: (error: string) => E
) =>
  flow(
    typeToCheck.decode,
    mapLeft((errors) => onFail(failure(errors).join("\n")))
  );

export const createBodyVerificationPipe =
  <E extends EndpointError, U>(typeToCheck: Type<U, unknown>) =>
  (req: Either<E, Request>): Either<EndpointError, U> =>
    pipe(
      req,
      map((request) => request.body as unknown),
      flatMap(
        createTypeCheckingFlow(typeToCheck, (errors) => ({
          status: StatusCodes.BAD_REQUEST,
          reason: `Recieved incorrect body parameters. error: ${errors}`,
        }))
      )
    );
