// בס"ד
import type { BPS, FuelObject, ShootEvent } from "@repo/scouting_types";
import {
  calculateAverage,
  calculateSum,
  firstElement,
  isEmpty,
  lastElement,
} from "@repo/array-functions";
import { convertPixelToCentimeters, distanceFromHub } from "@repo/rebuilt_map";
import { interpolateQuadratic } from "./interpolation";

interface ShotStats {
  duration: number;
  distance: number;
}

const EMPTY_INTERVAL_DURATION = 0;
const FIRST_INTERVAL_BOUNDARY = 0;
const NO_FUEL_COLLECTED = 0;
const FIRST_SECTION_AMOUNT = 1;
const LAST_SECTION_LENGTH = 1;

/**
 * @param sections consists of sections that contains a list of timestamps in ms
 * @returns mean ball amount
 */
const calculateBallAmount = (sections: number[][], shot: ShotStats): number => {
  // Base Case 1
  if (shot.duration <= EMPTY_INTERVAL_DURATION) {
    return NO_FUEL_COLLECTED;
  }

  // Base Case 2: Happens if no section is long enough for the shot length
  if (sections.length === LAST_SECTION_LENGTH) {
    const onlySection = firstElement(sections);
    const ballAmount = onlySection.length;
    const sectionDuration = lastElement(onlySection);
    return (ballAmount / sectionDuration) * shot.duration;
  }

  // finds the average for the first interval, removes it and then recurses
  const shortestSection = firstElement(sections);
  const firstIntervalDuration = lastElement(shortestSection);

  const adjustedSections = sections.map((section) =>
    section.map((timing) => timing - firstIntervalDuration),
  );

  const firstIntervalSections = adjustedSections.map((section) =>
    section.filter(
      (timing) => timing <= FIRST_INTERVAL_BOUNDARY && timing <= shot.duration,
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
    calculateBallAmount(nonFirstSections, {
      duration: shot.duration - firstIntervalDuration,
      distance: shot.distance,
    })
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
  sections: BPS["events"],
): Partial<FuelObject> => {
  const shotStats: ShotStats = {
    duration: shot.interval.end - shot.interval.start,
    distance: distanceFromHub(convertPixelToCentimeters(shot.startPosition)),
  };

  const formattedSections = formatSections(sections);

  const shotAmount = calculateBallAmount(
    formattedSections.map((section) => section.shoot),
    shotStats,
  );

  if (isPass) {
    return {
      shot: shotAmount,
      passed: shotAmount,
      positions: [shot.startPosition],
    };
  }
  const scoredAccuracy = interpolateQuadratic(
    shotStats.distance,
    calculateAccuracies(formattedSections, shotStats.duration).map(
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
