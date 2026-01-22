// בס"ד
import * as t from "io-ts";

export const matchesProps = t.type({
  event: t.string,
});

export type TBAMatchesProps = t.TypeOf<typeof matchesProps>;

// 1. Define the TBAAlliance codec
export const tbaAlliance = t.type({
  score: t.number,
  team_keys: t.array(t.string),
  surrogate_team_keys: t.array(t.string),
  dq_team_keys: t.array(t.string),
});

// 2. Define the generic TBAMatch codec constructor
export const tbaMatch = <A extends t.Mixed, M extends t.Mixed>(
  allianceBreakdown: A,
  miscBreakdown: M,
) =>
  t.type({
    key: t.string,
    comp_level: t.string,
    set_number: t.number,
    match_number: t.number,
    alliances: t.type({
      red: tbaAlliance,
      blue: tbaAlliance,
    }),
    winning_alliance: t.union([
      t.literal("red"),
      t.literal("blue"),
      t.literal(""), // "" is a tie
    ]),
    event_key: t.string,
    time: t.number,
    actual_time: t.union([t.number, t.null]),
    predicted_time: t.number,
    post_result_time: t.number,
    score_breakdown: t.intersection([
      t.type({
        red: allianceBreakdown,
        blue: allianceBreakdown,
      }),
      miscBreakdown,
    ]),
    videos: t.array(
      t.type({
        type: t.string,
        key: t.string,
      }),
    ),
  });
