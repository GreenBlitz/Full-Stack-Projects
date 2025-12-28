// בס"ד
import type { RequestHandler } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { StatusCodes } from "http-status-codes";
import { PathReporter } from "io-ts/lib/PathReporter";
import type { Props, TypeC } from "io-ts";

export const verifyBody =
  <U extends Props>(typeToCheck: TypeC<U>): RequestHandler =>
  (req, res, next): void => {
    const result = typeToCheck.decode(req.body);
    if (isLeft(result)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: PathReporter.report(result) });
    } else {
      next();
    }
  };
