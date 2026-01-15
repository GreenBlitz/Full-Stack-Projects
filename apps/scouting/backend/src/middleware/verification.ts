// בס"ד
import type { Request } from "express";
import { chain, chainW, type Either, map, mapLeft } from "fp-ts/lib/Either";
import { StatusCodes } from "http-status-codes";
import { failure } from "io-ts/lib/PathReporter";
import type { Props, TypeC } from "io-ts";
import { flow, pipe } from "fp-ts/lib/function";

export interface EndpointError {
  status: number;
  reason: string;
}

export const createBodyVerificationPipe =
  <E extends EndpointError, U extends Props>(typeToCheck: TypeC<U>) =>
  (req: Either<E, Request>) =>
    pipe(
      req,
      map((request) => request.body),
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
export const isOK = (status: StatusCodes): boolean =>
  status >= StatusCodes.OK && status < StatusCodes.MULTIPLE_CHOICES;
