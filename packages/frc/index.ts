import FRC_TEAMS from "./teams.json";
export { FRC_TEAMS };
export const FRC_TEAM_NUMBERS = FRC_TEAMS.map((team) => team.team_number);

export const getTeamName = (team: number) =>
  FRC_TEAMS.find(({ team_number }) => team_number === team)?.nickname ??
  "Unknown Team";

export type TeamString<N extends number = number> = `frc${N}`;
export const teamStringToTeamNumber = <
  N extends number,
  S extends string = TeamString<N>,
>(
  teamString: S,
): N => Number(teamString.replace("frc", "")) as N;
