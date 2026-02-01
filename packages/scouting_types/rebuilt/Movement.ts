// בס"ד
import * as t from "io-ts";
import type { ScoutingForm } from "./ScoutingForm";

export const teleMovementCodec = t.type({
  bumpStuck: t.boolean,
});

export const movementCodec = t.intersection([
  t.type({
    trenchPass: t.boolean,
    bumpPass: t.boolean,
  }),
  teleMovementCodec,
]);

export const defaultMovement: t.TypeOf<typeof movementCodec> = {
  trenchPass: false,
  bumpPass: false,
  bumpStuck: false,
};

export type Movement = ScoutingForm["tele" | "auto"]["movement"];