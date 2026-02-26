//בס"ד

import { ALLIANCE_ZONE_WIDTH_PIXELS } from "@repo/rebuilt_map";
import type { BPS, FuelObject, GamePeriod, GeneralFuelData, Match, Point, ScoutingForm, ShiftsArray, ShootEvent } from "@repo/scouting_types";

const DIGITS_AFTER_DECIMAL_DOT = 2;

const isShotPass = (positionPixels: Point) =>
  positionPixels.x > ALLIANCE_ZONE_WIDTH_PIXELS;

const emptyFuelObject: FuelObject = {
  shot: 0,
  passed: 0,
  scored: 0,
  missed: 0,
  positions: [],
};

const putDefaultsInFuel = (fuel: Partial<FuelObject>) => ({
  ...emptyFuelObject,
  ...fuel,
});

export const createFuelObject = (
  shot: ShootEvent,
  match: Match,
  bpses: BPS[],
): FuelObject => {
  const sameMatch = bpses.find(
    (value) =>
      value.match.number === match.number && value.match.type === match.type,
  );

  const isPass = isShotPass(shot.startPosition);

  const partialFuel = sameMatch
    ? calculateFuelByMatch(shot, isPass, sameMatch)
    : calculateFuelByAveraging(
        shot,
        isPass,
        bpses.flatMap((bps) => bps.events),
      );
  return putDefaultsInFuel(partialFuel);
};


export const calculateFuelStatisticsOfShift = (
  match: ScoutingForm["match"],
  bpsArray: BPS[],
  shifts: ShiftsArray,
): FuelObject =>
  shifts
    .flatMap((shift) => shift.shootEvents)
    .map((event) => createFuelObject(event, match, bpsArray))
    .reduce(
      (accumulate, fuelObject) => ({
        scored: accumulate.scored + fuelObject.scored,
        missed: accumulate.missed + fuelObject.missed,
        shot: accumulate.shot + fuelObject.shot,
        passed: accumulate.passed + fuelObject.passed,
        positions: [...accumulate.positions, ...fuelObject.positions],
      }),
      { scored: 0, missed: 0, shot: 0, passed: 0, positions: [] },
    );




export const generalCalculateFuel = (
  scoutingForm: ScoutingForm,
  bpsArray: BPS[],
): GeneralFuelData => {
  const teleShifts = [
    scoutingForm.tele.transitionShift,
    ...scoutingForm.tele.shifts,
    scoutingForm.tele.endgameShift,
  ];
  const fullGameShifts = [scoutingForm.auto, ...teleShifts];
  const calculateShiftFuel = calculateFuelStatisticsOfShift.bind(
    null,
    scoutingForm.match,
    bpsArray,
  );

  const autoFuel = calculateShiftFuel([scoutingForm.auto]);

  const teleFuel = calculateShiftFuel(teleShifts);
  const fullGameFuel = calculateShiftFuel(fullGameShifts);
  return {
    fullGame: fullGameFuel,
    auto: autoFuel,
    tele: teleFuel,
  };
};


const calculateAverageScoredFuel = (
  forms: ScoutingForm[],
  gamePeriod: GamePeriod,
) => {
  const generalFuelData = forms.map((form) =>
    generalCalculateFuel(form, getAllBPS()),
  );
  const averagedFuelData = calcAverageGeneralFuelData(generalFuelData);
  console.log(
    `auto fuel: ${averagedFuelData.auto.scored.toFixed(DIGITS_AFTER_DECIMAL_DOT)}`,
  );
  console.log(
    `fullGame fuel: ${averagedFuelData.fullGame.scored.toFixed(DIGITS_AFTER_DECIMAL_DOT)}`,
  );

  return parseFloat(
    averagedFuelData[gamePeriod].scored.toFixed(DIGITS_AFTER_DECIMAL_DOT),
  );
};

