// בס"ד
import type { ShootEvent } from "@repo/scouting_types";
import type { BPS, FuelObject } from "./fuel-object";

/**
 * Filters timestamps that fall within the shooting interval
 * @param section - Array of timestamps to filter
 * @param shot - ShootEvent containing the interval to check against
 * @returns Array of timestamps that are within the shooting interval
 */
const getIncludedShots = (section: number[], shot: ShootEvent) => {
  return section.filter(
    (timestamp) =>
      timestamp > shot.interval.start && timestamp < shot.interval.end,
  );
};

/**
 * Calculates fuel statistics for a shooting event based on match-specific BPS data
 * @param shot - The shooting event containing interval and positions
 * @param bps - Ball Processing System data for the match
 * @returns FuelObject with shot count, scored count, missed count, and positions array
 */
export const calculateFuelByMatch = (
  shot: ShootEvent,
  bps: BPS,
): FuelObject => {
  // Map each BPS event section to filtered shots within the shooting interval
  const shotBps = bps.events.map((section) => ({
    score: getIncludedShots(section.score, shot),
    shoot: getIncludedShots(section.shoot, shot),
  }));

  // Calculate total shots and scored shots by flattening all sections
  const shotAmount = shotBps.flatMap((section) => section.shoot).length;
  const scoredAmount = shotBps.flatMap((section) => section.score).length;

  return {
    shot: shotAmount,
    scored: scoredAmount,
    missed: shotAmount - scoredAmount,
    // Use the positions array from the shot event (recorded every 0.1 seconds)
    positions: shot.positions,
  };
};
