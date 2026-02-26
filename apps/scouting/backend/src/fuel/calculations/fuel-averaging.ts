// בס"ד
import type {
  BPS,
  BPSEvent,
  FuelObject,
  ShootEvent,
} from "@repo/scouting_types";
import {
  calculateAverage,
  calculateSum,
  firstElement,
  getMax,
  isEmpty,
  lastElement,
} from "@repo/array-functions";
import { convertPixelToCentimeters, distanceFromHub } from "@repo/rebuilt_map";
import { interpolateQuadratic } from "./interpolation";

interface ShotStats {
  durationMilliseconds: number;
  hubDistanceCentimeters: number;
}

const EMPTY_INTERVAL_DURATION = 0;
const FIRST_INTERVAL_BOUNDARY = 0;
const NO_FUEL_COLLECTED = 0;
const FIRST_SECTION_AMOUNT = 1;
const ONE_SECTION_ONLY_LENGTH = 1;

/**
 * @param sections consists of sections that contains a list of timestamps in ms
 * @returns mean ball amount
 */
const calculateBallAmount = (
  sections: number[][],
  shotDuration: number,
): number => {
  // Base Case 1
  if (shotDuration <= EMPTY_INTERVAL_DURATION) {
    return NO_FUEL_COLLECTED;
  }
  // Base Case 2: Happens if no section is long enough for the shot length
  if (sections.length === ONE_SECTION_ONLY_LENGTH) {
    const onlySection = firstElement(sections);
    const ballAmount = onlySection.length;
    const sectionDuration = lastElement(onlySection);
    return (ballAmount / sectionDuration) * shotDuration;
  }

  // finds the average for the first interval, removes it and then recurses
  const shortestSection = firstElement(sections);
  const firstIntervalDuration = lastElement(shortestSection);

  const adjustedSections = sections.map((section) =>
    section.map((timing) => timing - firstIntervalDuration),
  );

  const firstIntervalSections = adjustedSections.map((section) =>
    section.filter(
      (timing) => timing <= FIRST_INTERVAL_BOUNDARY && timing <= shotDuration,
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
    calculateBallAmount(nonFirstSections, shotDuration - firstIntervalDuration)
  );
};

const calculateAccuracies = (sections: BPS["events"], shotDuration: number) => {
  const durationedSections = sections.map((section) => ({
    shoot: section.shoot.filter((timestamp) => timestamp <= shotDuration),
    score: section.score.filter((timestamp) => timestamp <= shotDuration),
    positions: section.positions,
  }));

  const filteredSections = durationedSections.filter(
    (section) => !isEmpty(section.shoot),
  );

  const accuracies = filteredSections.map((section) => ({
    distance: calculateAverage(section.positions, (point) =>
      distanceFromHub(convertPixelToCentimeters(point)),
    ),
    accuracy: section.score.length / section.shoot.length,
  }));
  const sortedAccuracies = accuracies.sort(
    (accuracy1, accuracy2) => accuracy1.distance - accuracy2.distance,
  );

  return sortedAccuracies;
};

const MILLISECONDS_IN_SECONDS = 1000;

export const calculateAverageBPS = (bpses: BPS[]) => {
  const formattedSections = formatSections(bpses.flatMap((bps) => bps.events));

  const longestSection = getMax(formattedSections, (section) =>
    lastElement(section.shoot),
  );

  const longestSectionDuration = lastElement(longestSection.shoot);

  const shotAmount = calculateBallAmount(
    formattedSections.map((section) => section.shoot),
    longestSectionDuration,
  );

  return (shotAmount * MILLISECONDS_IN_SECONDS) / longestSectionDuration;
};

const compareSections = (section1: number[], section2: number[]) =>
  lastElement(section1) - lastElement(section2);

const correctSectionToTimeFromEnd = (sections: number[]) => {
  const endTimestamp = lastElement(sections);
  return sections.map((timestamp) => endTimestamp - timestamp).reverse();
};

const formatSections = (sections: BPS["events"]) =>
  sections
    .map((section) => ({
      ...section,
      score: correctSectionToTimeFromEnd(section.score),
      shoot: correctSectionToTimeFromEnd(section.shoot),
    }))
    .sort((formattedSection1, formattedSection2) =>
      compareSections(formattedSection1.shoot, formattedSection2.shoot),
    );

export const calculateFuelByAveraging = (
  shot: ShootEvent,
  isPass: boolean,
  sections: BPSEvent[],
): Partial<FuelObject> => {
  const shotStats: ShotStats = {
    durationMilliseconds: shot.interval.end - shot.interval.start,
    hubDistanceCentimeters: distanceFromHub(
      convertPixelToCentimeters(shot.startPosition),
    ),
  };

  const formattedSections = formatSections(sections);

  const shotAmount = calculateBallAmount(
    formattedSections.map((section) => section.shoot),
    shotStats.durationMilliseconds,
  );

  if (isPass) {
    return {
      shot: shotAmount,
      passed: shotAmount,
      positions: [shot.startPosition],
    };
  }
  const scoredAccuracy = interpolateQuadratic(
    shotStats.hubDistanceCentimeters,
    calculateAccuracies(formattedSections, shotStats.durationMilliseconds).map(
      ({ distance, accuracy }) => ({ x: distance, y: accuracy }),
    ),
  );

  const scoredAmount = shotAmount * scoredAccuracy;

  return {
    scored: scoredAmount,
    shot: shotAmount,
    missed: shotAmount - scoredAmount,
    positions: [shot.startPosition],
  };
};
