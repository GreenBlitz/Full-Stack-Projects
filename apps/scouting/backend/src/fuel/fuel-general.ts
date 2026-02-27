// בס"ד
import { firstElement, isEmpty } from "@repo/array-functions";
import { averageFuel } from "./distance-split";
import { createFuelObject } from "./fuel-object";
import type {
  BPS,
  FuelObject,
  GamePeriod,
  GeneralFuelData,
  Match,
  ScoutingForm,
  ShiftsArray,
} from "@repo/scouting_types";
import { flow } from "fp-ts/lib/function";
import * as Array from "fp-ts/lib/Array";
import * as NonEmptyArray from "fp-ts/lib/NonEmptyArray";
import * as Record from "fp-ts/lib/Record";

export const calculateFuelStatisticsOfShift = (
  match: Match,
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

interface AccumulatedFuelData {
  fullGame: FuelObject[];
  auto: FuelObject[];
  tele: FuelObject[];
}

const ONE_ITEM_ARRAY = 1;
export const calcAverageGeneralFuelData = (
  fuelData: GeneralFuelData[],
): GeneralFuelData => {
  if (fuelData.length === ONE_ITEM_ARRAY || isEmpty(fuelData)) {
    return firstElement(fuelData);
  }

  const accumulatedFuelData: AccumulatedFuelData =
    fuelData.reduce<AccumulatedFuelData>(
      (accumulated, currentFuelData) => ({
        fullGame: [...accumulated.fullGame, currentFuelData.fullGame],
        auto: [...accumulated.auto, currentFuelData.auto],
        tele: [...accumulated.tele, currentFuelData.tele],
      }),
      {
        fullGame: [],
        auto: [],
        tele: [],
      },
    );

  const averagedFuelData: GeneralFuelData = {
    fullGame: averageFuel(accumulatedFuelData.fullGame),
    auto: averageFuel(accumulatedFuelData.auto),
    tele: averageFuel(accumulatedFuelData.tele),
  };

  return averagedFuelData;
};

const DIGITS_AFTER_DECIMAL_DOT = 2;
export const calculateAverageScoredFuel = (
  forms: ScoutingForm[],
  gamePeriod: GamePeriod,
  bpses: BPS[],
) => {
  const generalFuelData = forms.map((form) =>
    generalCalculateFuel(form, bpses),
  );
  const averagedFuelData = calcAverageGeneralFuelData(generalFuelData);

  return parseFloat(
    averagedFuelData[gamePeriod].scored.toFixed(DIGITS_AFTER_DECIMAL_DOT),
  );
};

export const formsToFuelData = (bpses: Record<string, BPS[]>) =>
  flow(
    Array.map((form: ScoutingForm) => ({
      teamNumber: form.teamNumber,
      generalFuelData: generalCalculateFuel(form, bpses[form.teamNumber]),
    })),

    NonEmptyArray.groupBy((fuelData) => fuelData.teamNumber.toString()),

    Record.map((fuels) =>
      calcAverageGeneralFuelData(
        fuels.map((fuelData) => fuelData.generalFuelData),
      ),
    ),
  );
