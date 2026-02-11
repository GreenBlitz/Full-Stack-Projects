// בס"ד
import type { FuelObject, ShootEvent } from "@repo/scouting_types";
import type { BPS } from "../fuel-object";

const getIncludedShots = (section: number[], shot: ShootEvent) => {
  return section.filter(
    (timestamp) =>
      timestamp > shot.interval.start && timestamp < shot.interval.end,
  );
};
export const calculateFuelByMatch = (
  shot: ShootEvent,
  isPass: boolean,
  bps: BPS,
): Partial<FuelObject> => {
  const shotBps = bps.events.map((section) => ({
    score: getIncludedShots(section.score, shot),
    shoot: getIncludedShots(section.shoot, shot),
  }));

  const shotAmount = shotBps.flatMap((section) => section.shoot).length;

  if (isPass) {
    return {
      shot: shotAmount,
      passed: shotAmount,
      positions: [shot.startPosition],
    };
  }

  const scoredAmount = shotBps.flatMap((section) => section.score).length;

  return {
    shot: shotAmount,
    scored: scoredAmount,
    missed: shotAmount - scoredAmount,
    positions: [shot.startPosition],
  };
};
