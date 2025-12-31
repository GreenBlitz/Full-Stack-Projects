// בס"ד

import type { Request } from "express";

export interface BodiedRequest<Body> extends Request {
  body: Body;
}
