// בס"ד
import * as t from "io-ts";

const sideMovement = t.type({
  trenchPass: t.number,
  bumpPass: t.number,
  bumpStuck: t.number,
});

export const teleMovementCodec = t.type({
  ally: sideMovement,
  opponent: sideMovement,
});

export const defaultSideMovement: t.TypeOf<typeof sideMovement> = {
  trenchPass: 0,
  bumpPass: 0,
  bumpStuck: 0,
};

export const defaultMovement: t.TypeOf<typeof teleMovementCodec> = {
  ally: defaultSideMovement,
  opponent: defaultSideMovement,
};

export type TeleMovement = t.TypeOf<typeof teleMovementCodec>;
export type Movement = TeleMovement;
