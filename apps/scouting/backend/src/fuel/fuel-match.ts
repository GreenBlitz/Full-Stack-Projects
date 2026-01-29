// בס"ד
import type { Match, ShootEvent } from "@repo/scouting_types";
import type { BPS, FuelObject } from "./fuel-object";

const getIncludedShots = (section: number[], shot: ShootEvent) => {
  return section.filter(
    (timestamp) =>
      timestamp > shot.interval.start && timestamp < shot.interval.end,
  );
};
export const calculateFuelByMatch = (
  shot: ShootEvent,
  bps: BPS,
  match: Match,
): FuelObject => {
  const shotBps = bps.gameEvents.map((section) => ({
    score: getIncludedShots(section.score, shot),
    shoot: getIncludedShots(section.shoot, shot),
  }));

  const shotAmount = shotBps.flatMap((section) => section.shoot).length;
  const scoredAmount = shotBps.flatMap((section) => section.score).length;

  return {
    shot: shotAmount,
    scored: scoredAmount,
    missed: shotAmount - scoredAmount,
    match,
    position: shot.startPosition,
  };
};
