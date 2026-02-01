// בס"ד
import type { BPS, FuelObject } from "./fuel-object";
import { createFuelObject } from "./fuel-object";
import type { ScoutingForm, shootEventsArray } from "@repo/scouting_types";

interface GeneralFuelData {
    fullGame:FuelObject;
    auto:FuelObject;
    tele:FuelObject;
}

const calculateShiftFuel = (
    match: ScoutingForm["match"],
    bpsArray: BPS[], shifts:shootEventsArray): FuelObject => 
        shifts
           .flatMap(shift => shift.shootEvents)
           .map(event => createFuelObject(event, match, bpsArray))
           .reduce((acc, fuelObject) => ({
           scored: acc.scored + fuelObject.scored,
           missed: acc.missed + fuelObject.missed,
           shot: acc.shot + fuelObject.shot,
           positions: [...acc.positions, ...fuelObject.positions]
       }), { scored: 0, missed: 0, shot: 0, positions: [] })

export const calculateFuel = (scoutingForm: ScoutingForm, bpsArray: BPS[]): GeneralFuelData => {
    const teleShifts = [
        ...scoutingForm.tele.shifts,
        scoutingForm.tele.endgameShift,
        scoutingForm.tele.transitionShift
    ];
    const fullGameShifts = [
        ...teleShifts,
        scoutingForm.auto,
    ];
    const bindcalcShiftFuel = calculateShiftFuel.bind(null, scoutingForm.match, bpsArray);
    const autoFuel = bindcalcShiftFuel([scoutingForm.auto]);
    const teleFuel = bindcalcShiftFuel(teleShifts);
    const fullGameFuel = bindcalcShiftFuel(fullGameShifts);
    return { 
        fullGame: fullGameFuel, 
        auto: autoFuel, 
        tele: teleFuel 
    };
}