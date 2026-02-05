// בס"ד
import * as t from "io-ts";
import type {
  AutoClimb,
  AutoMovement,
  Climb,
  Match,
  TeleClimb,
  TeleMovement,
} from "../rebuilt";

export const teamsProps = t.type({
  teams: t.array(t.number),
});

type AccuracyDistances = 1 | 2 | 20;

// to be replaced with actual fuel object
// once the fuel package is merged

interface FuelObject {
  scored: number;
  shot: number;
  missed: number;
}

type MatchedEntry<Entry> = { match: Match } & Entry;
export interface SectionTeamData {
  fuel: MatchedEntry<FuelObject>[];
  accuracy: Record<AccuracyDistances, FuelObject>;

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
