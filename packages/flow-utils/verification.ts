// בס"ד
import type { Request } from "express";
import { type Either, map } from "fp-ts/lib/Either";
import { StatusCodes } from "http-status-codes";
import { pipe } from "fp-ts/lib/function";
import type { Type } from "io-ts";
import { createTypeCheckingEndpointFlow } from "@repo/type-utils";

export interface EndpointError {
  status: number;
  reason: string;
}

export const createBodyVerificationPipe =
  <E extends EndpointError, U>(typeToCheck: Type<U, unknown>) =>
  (req: Either<E, Request>): Either<EndpointError, U> =>
    pipe(
      req,
      map((request) => request.body as unknown),
      createTypeCheckingEndpointFlow(typeToCheck, (errors) => ({
        status: StatusCodes.BAD_REQUEST,
        reason: `Received incorrect body parameters. error: ${errors}`,
      })),
    );
