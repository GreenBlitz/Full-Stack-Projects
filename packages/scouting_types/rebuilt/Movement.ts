// בס"ד
import * as t from "io-ts";

export const teleMovementCodec = t.type({
  bumpStuck: t.boolean,
});

export const autoMovementCodec = t.intersection([
  t.type({
    trenchPass: t.boolean,
    bumpPass: t.boolean,
  }),
  teleMovementCodec,
]);

export const defaultMovement: t.TypeOf<typeof autoMovementCodec> = {
  trenchPass: false,
  bumpPass: false,
  bumpStuck: false,
};

export type AutoMovement = t.TypeOf<typeof autoMovementCodec>;
export type TeleMovement = t.TypeOf<typeof teleMovementCodec>
export type Movement = AutoMovement | TeleMovement;
