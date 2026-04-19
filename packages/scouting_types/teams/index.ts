// בס"ד
import * as t from "io-ts";
import type {
  AutoClimb,
  AutoMovement,
  Climb,
  FuelObject,
  Match,
  TeleClimb,
  TeleMovement,
} from "../rebuilt";
import type { TeamOPR } from "../tba";
import type { EPA } from "../epa";

export const teamsProps = t.type({
  teams: t.union([t.array(t.number), t.number]),
  recency: t.union([t.number, t.undefined]),
});

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const ACCURACY_DISTANCES = [150, 300, 2000] as const;

export type MatchedEntry<Entry> = { match: Match } & Entry;
export interface SectionTeamData {
  fuel: MatchedEntry<FuelObject>[];
  accuracy: Record<
    (typeof ACCURACY_DISTANCES)[number],
    FuelObject & { amount: number }
  >;
}
interface SectionSpecificTeamData<
  Movement extends TeleMovement = TeleMovement,
  Climbing extends Climb = TeleClimb,
> {
  movement: Record<keyof Movement, number>;
  climbs: MatchedEntry<Climbing>[];
}

export interface TeamData {
  tele: SectionTeamData & SectionSpecificTeamData;
  auto: SectionTeamData & SectionSpecificTeamData<AutoMovement, AutoClimb>;
  fullGame: SectionTeamData;
  metrics: { epa: EPA | undefined; bps: number; coprs: TeamOPR | undefined };
  /** Matches scouted as no-show (excluded from stats above). */
  noShowMatches: Match[];
}

export type GamePhase = "tele" | "auto" | "fullGame";
