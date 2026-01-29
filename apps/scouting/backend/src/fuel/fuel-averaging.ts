// בס"ד
import type { Match, ShootEvent } from "@repo/scouting_types";
import type { BPS, FuelObject } from "./fuel-object";
const defaultStartingSumValue = 0;
const calculateSum = <T>(
  arr: T[],
  transformation: (value: T) => number,
  startingSumValue = defaultStartingSumValue,
) => arr.reduce((sum, value) => sum + transformation(value), startingSumValue);

const LAST_ELEMENT_BACKWARDS_INDEX = 1;
const EMPTY_INTERVAL = 0;
const FIRST_INTERVAL_INDEX = 0;
const FIRST_INTERVAL_LIMIT = 0;
const NO_BALLS_COLLECTED = 0;
const FIRST_SECTION_AMOUNT = 1;
const LAST_SECTION_LENGTH = 1;

/**
 * @param sections consists of sections that contains a list of timestamps in ms
 * @returns mean ball amount
 */
const calculateBallAmount = (
  sections: number[][],
  shotLength: number,
): number => {
  // Base Case 1
  if (shotLength <= EMPTY_INTERVAL) {
    return NO_BALLS_COLLECTED;
  }
  // Base Case 2: Happens if no section is long enough for the shot length
  if (sections.length === LAST_SECTION_LENGTH) {
    const onlySection = sections[FIRST_INTERVAL_INDEX];
    const ballAmount = calculateSum(onlySection, (value) => value);
    const sectionDuration =
      onlySection[onlySection.length - LAST_ELEMENT_BACKWARDS_INDEX];
    return (ballAmount / sectionDuration) * shotLength;
  }

  // finds the average for the first interval, removes it and then recurses
  const firstInterval = sections[FIRST_INTERVAL_INDEX];
  const firstIntervalDuration =
    firstInterval[firstInterval.length - LAST_ELEMENT_BACKWARDS_INDEX];

  const adjustedSections = sections.map((section) =>
    section.map((timing) => timing - firstIntervalDuration),
  );
  const firstIntervalSections = adjustedSections.map((section) =>
    section.filter((timing) => timing <= FIRST_INTERVAL_LIMIT),
  );

  const avgBallsFirstInterval =
    calculateSum(firstIntervalSections, (section) => section.length) /
    firstIntervalSections.length;

  const nonFirstSections = adjustedSections
    .slice(FIRST_SECTION_AMOUNT)
    .map((section) =>
      section.filter((timing) => timing > FIRST_INTERVAL_LIMIT),
    );
  return (
    avgBallsFirstInterval +
    calculateBallAmount(nonFirstSections, shotLength - firstIntervalDuration)
  );
};

const sortSections = (a: number[], b: number[]) =>
  a[a.length - LAST_ELEMENT_BACKWARDS_INDEX] -
  b[b.length - LAST_ELEMENT_BACKWARDS_INDEX];

export const calculateFuelByAveraging = (
  shot: ShootEvent,
  match: Match,
  sections: BPS["gameEvents"],
): FuelObject => {
  const shotLength = shot.interval.end - shot.interval.start;

  const scoredAmount = calculateBallAmount(
    sections.map((section) => section.score).sort(sortSections),
    shotLength,
  );

  const shotAmount = calculateBallAmount(
    sections.map((section) => section.shoot).sort(sortSections),
    shotLength,
  );

  return {
    scored: scoredAmount,
    shot: shotAmount,
    missed: shotAmount - scoredAmount,
    position: shot.startPosition,
    match,
  };
};
