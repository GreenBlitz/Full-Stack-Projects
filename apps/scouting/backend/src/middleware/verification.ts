// בס"ד
import type { Request } from "express";
import { chain, type Either, map, mapLeft } from "fp-ts/lib/Either";
import { StatusCodes } from "http-status-codes";
import { failure } from "io-ts/lib/PathReporter";
import { pipe } from "fp-ts/lib/function";
import type { MixedType } from "@repo/type_verification";

export interface EndpointError {
  status: number;
  reason: string;
}

export const createBodyVerificationPipe =
  <E extends EndpointError, U>(typeToCheck: MixedType<U>) =>
  (req: Either<E, Request>): Either<EndpointError, U> =>
    pipe(
      req,

      map((request) => request.body as unknown),
      chain((body) =>
        pipe(
          typeToCheck.decode(body),
          mapLeft((error) => ({
            status: StatusCodes.BAD_REQUEST,
            reason: `Recieved incorrect body parameters. error: ${failure(error).join("\n")}`,
          }))
        )
      )
    );
