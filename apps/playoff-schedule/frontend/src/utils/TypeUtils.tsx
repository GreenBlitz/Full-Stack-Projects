// בס"ד
import * as t from "io-ts";
export const numberOrNull = t.union([t.number, t.null]); //for if type is null
export const stringOrNull = t.union([t.string, t.null]); //for if type is null
