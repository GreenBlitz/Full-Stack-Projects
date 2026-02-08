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

export const teamsProps = t.type({
  teams: t.union([t.array(t.number), t.number]),
});

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const ACCURACY_DISTANCES = [100, 200, 2000] as const;

type MatchedEntry<Entry> = { match: Match } & Entry;
export interface SectionTeamData {
  fuel: MatchedEntry<FuelObject>[];
  accuracy: Record<(typeof ACCURACY_DISTANCES)[number], FuelObject>;

  copr: number; //Compoent offensive power ranking (from tba)
  cdpr: number; //Component defensive power ranking (from tba)
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
  metrics: { epa: number; bps: number };
}
