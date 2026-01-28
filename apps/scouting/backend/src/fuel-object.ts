// בס"ד
import type { GameObject } from "./game-object";
import type {
  Match,
  Point,
  ShootEvent,
} from "@repo/scouting_types";

type BPS = GameObject<{ shoot: number[]; score: number[] }>;

interface FuelObject {
  scored: number;
  shot: number;
  missed: number;
  position: Point;
  match: Match;
}

const getSectionLength = (sectionShot: number[]) =>
  sectionShot[sectionShot.length - 1] - sectionShot[0];

const calculateBallAmount = (sections: number[][], shotLength: number) => {
  const smallerSections = sections.filter(
    (section) => getSectionLength(section) < shotLength,
  );

  const largerSections = sections.filter(
    (section) => getSectionLength(section) >= shotLength,
  );

  const lengths =
    smallerSections.reduce((sum, value) => sum + getSectionLength(value), 0) +
    largerSections.length * shotLength;

  const balls =
    smallerSections.reduce((sum, value) => sum + value.length, 0) +
    largerSections.reduce(
      (sum, value) => sum + value.filter((time) => time <= shotLength).length,
      0,
    );

  return (balls * lengths) / sections.length;
};

const createFuelObject = (
  shot: ShootEvent,
  match: Match,
  bpses: BPS[],
): FuelObject => {
  const sections = bpses.flatMap((bps) => bps.gameEvents);

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
