// בס"ד
import type { Match, ShootEvent } from "@repo/scouting_types";
import type { BPS, FuelObject } from "../fuel-object";
import { calculateSum, firstElement, lastElement } from "@repo/array-functions";

const EMPTY_INTERVAL_DURATION = 0;
const FIRST_INTERVAL_BOUNDARY = 0;
const NO_FUEL_COLLECTED = 0;
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
  if (shotLength <= EMPTY_INTERVAL_DURATION) {
    return NO_FUEL_COLLECTED;
  }
  // Base Case 2: Happens if no section is long enough for the shot length
  if (sections.length === LAST_SECTION_LENGTH) {
    const onlySection = firstElement(sections);
    const ballAmount = onlySection.length;
    const sectionDuration = lastElement(onlySection);
    return (ballAmount / sectionDuration) * shotLength;
  }

  // finds the average for the first interval, removes it and then recurses
  const shortestSection = firstElement(sections);
  const firstIntervalDuration = lastElement(shortestSection);

  const adjustedSections = sections.map((section) =>
    section.map((timing) => timing - firstIntervalDuration),
  );
  const firstIntervalSections = adjustedSections.map((section) =>
    section.filter(
      (timing) => timing <= FIRST_INTERVAL_BOUNDARY && timing <= shotLength,
    ),
  );

  const avgBallsFirstInterval =
    calculateSum(firstIntervalSections, (section) => section.length) /
    firstIntervalSections.length;

  const nonFirstSections = adjustedSections
    .slice(FIRST_SECTION_AMOUNT)
    .map((section) =>
      section.filter((timing) => timing > FIRST_INTERVAL_BOUNDARY),
    );
  return (
    avgBallsFirstInterval +
    calculateBallAmount(nonFirstSections, shotLength - firstIntervalDuration)
  );
};

const compareSections = (a: number[], b: number[]) =>
  lastElement(a) - lastElement(b);

const correctSectionToTimeFromEnd = (sections: number[]) => {
  const endTimestamp = lastElement(sections);
  return sections
    .filter((timestamp) => timestamp < endTimestamp)
    .map((timestamp) => endTimestamp - timestamp);
};

export const calculateFuelByAveraging = (
  shot: ShootEvent,
  match: Match,
  sections: BPS["events"],
): FuelObject => {
  const shotLength = shot.interval.end - shot.interval.start;

  const scoredAmount = calculateBallAmount(
    sections
      .map((section) => section.score)
      .map(correctSectionToTimeFromEnd)
      .sort(compareSections),
    shotLength,
  );

  const shotAmount = calculateBallAmount(
    sections
      .map((section) => section.shoot)
      .map(correctSectionToTimeFromEnd)
      .sort(compareSections),
    shotLength,
  );

  return {
    scored: scoredAmount,
    shot: shotAmount,
    missed: shotAmount - scoredAmount,
    positions: [shot.startPosition],
  };
};
