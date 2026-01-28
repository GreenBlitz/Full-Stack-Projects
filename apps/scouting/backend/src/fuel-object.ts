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

const FIRST_ELEMENT_INDEX = 0;
const LAST_ELEMENT_BACKWARDS_INDEX = 1;
const getSectionLength = (sectionShot: number[]) =>
  sectionShot[sectionShot.length - LAST_ELEMENT_BACKWARDS_INDEX] -
  sectionShot[FIRST_ELEMENT_INDEX];

const calculateBallAmount = (sections: number[][], shotLength: number) => {
  const smallerSections = sections.filter(
    (section) => getSectionLength(section) < shotLength,
  );

  const largerSections = sections.filter(
    (section) => getSectionLength(section) >= shotLength,
  );

  const lengths =
    calculateSum(smallerSections, getSectionLength) +
    largerSections.length * shotLength;

  const balls =
    calculateSum(smallerSections, (value) => value.length) +
    calculateSum(
      largerSections,
      (value) => value.filter((time) => time <= shotLength).length,
    );

  return (balls * lengths) / (sections.length * sections.length);
};

const calculateFuelByAveraging = (
  shot: ShootEvent,
  match: Match,
  sections: BPS["gameEvents"],
): FuelObject => {
  const shotLength = shot.interval.end - shot.interval.start;

  const scoredAmount = calculateBallAmount(
    sections.map((section) => section.score),
    shotLength,
  );

  const shotAmount = calculateBallAmount(
    sections.map((section) => section.shoot),
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
