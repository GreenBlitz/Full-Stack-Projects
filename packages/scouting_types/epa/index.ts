import * as t from "io-ts";

export const statboticsEpaCodec = t.type({
  total_points: t.type({
    mean: t.number,
    sd: t.number,
  }),
  unitless: t.number,
  norm: t.number,
  conf: t.tuple([t.number, t.number]),
  breakdown: t.type({
    total_points: t.number,
    auto_points: t.number,
    teleop_points: t.number,
    endgame_points: t.number,
    energized_rp: t.number,
    supercharged_rp: t.number,
    traversal_rp: t.number,
    tiebreaker_points: t.number,
    auto_fuel: t.number,
    auto_tower: t.number,
    transition_fuel: t.number,
    first_shift_fuel: t.number,
    second_shift_fuel: t.number,
    teleop_fuel: t.number,
    endgame_fuel: t.number,
    endgame_tower: t.number,
    total_fuel: t.number,
    total_tower: t.number,
    rp_1: t.number,
    rp_2: t.number,
    rp_3: t.number,
  }),
});

export const teamsYear = t.array(
  t.type({ epa: statboticsEpaCodec, team: t.number }),
);

export type EPA = t.TypeOf<typeof statboticsEpaCodec>;
