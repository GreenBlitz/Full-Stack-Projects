// בס"ד
import * as t from "io-ts";

export const matchesProps = t.type({
  event: t.string,
});

export type TBAMatchesProps = t.TypeOf<typeof matchesProps>;

export const tbaAlliance = t.type({
  score: t.number,
  team_keys: t.array(t.string),
  surrogate_team_keys: t.array(t.string),
  dq_team_keys: t.array(t.string),
});

const optionalNumber = t.union([t.number, t.null]);

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
    winning_alliance: t.keyof({ red: null, blue: null, "": null }),
    event_key: t.string,
    time: optionalNumber,
    actual_time: optionalNumber,
    predicted_time: optionalNumber,
    post_result_time: optionalNumber,
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
