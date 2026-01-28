// בס"ד
import type { GameObject } from "./game-object";
import type { Match, Point, ShootEvent } from "@repo/scouting_types";

type BPS = GameObject<{ shoot: number[]; score: number[] }>;

interface FuelObject {
  scored: number;
  shot: number;
  missed: number;
  position: Point;
  match: Match;
}

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
const calculateBallAmount = (
  sections: number[][],
  shotLength: number,
): number => {
  if (shotLength <= EMPTY_INTERVAL) {
    return NO_BALLS_COLLECTED;
  }
  if (sections.length === LAST_SECTION_LENGTH) {
    const onlySection = sections[FIRST_INTERVAL_INDEX];
    const ballAmount = calculateSum(onlySection, (value) => value);
    const sectionDuration =
      onlySection[onlySection.length - LAST_ELEMENT_BACKWARDS_INDEX];
    return (ballAmount / sectionDuration) * shotLength;
  }
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

const calculateFuelByAveraging = (
  shot: ShootEvent,
  match: Match,
  sections: BPS["gameEvents"],
): FuelObject => {
  const shotLength = shot.interval.end - shot.interval.start;

  const scoredAmount = calculateBallAmount(
    sections
      .map((section) => section.score)
      .sort(
        (a, b) =>
          a[a.length - LAST_ELEMENT_BACKWARDS_INDEX] -
          b[b.length - LAST_ELEMENT_BACKWARDS_INDEX],
      ),
    shotLength,
  );

  const shotAmount = calculateBallAmount(
    sections
      .map((section) => section.score)
      .sort(
        (a, b) =>
          a[a.length - LAST_ELEMENT_BACKWARDS_INDEX] -
          b[b.length - LAST_ELEMENT_BACKWARDS_INDEX],
      ),
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

export const createFuelObject = (
  shot: ShootEvent,
  match: Match,
  bpses: BPS[],
): FuelObject => {
  return calculateFuelByAveraging(
    shot,
    match,
    bpses.flatMap((bps) => bps.gameEvents),
  );
};
