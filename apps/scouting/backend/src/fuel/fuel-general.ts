// בס"ד
import { createFuelObject } from "./fuel-object";
import type { BPS, FuelObject, GeneralFuelData, ScoutingForm, ShiftsArray } from "@repo/scouting_types";



const calculateFuelStatisticsOfShift = (
    match: ScoutingForm["match"],
    bpsArray: BPS[], shifts: ShiftsArray): FuelObject => 
        shifts
           .flatMap(shift => shift.shootEvents)
           .map(event => createFuelObject(event, match, bpsArray))
           .reduce((accumulate, fuelObject) => ({
           scored: accumulate.scored + fuelObject.scored,
           missed: accumulate.missed + fuelObject.missed,
           shot: accumulate.shot + fuelObject.shot,
           positions: [...accumulate.positions, ...fuelObject.positions]
       }), { scored: 0, missed: 0, shot: 0, positions: [] })

export const generalCalculateFuel = (scoutingForm: ScoutingForm, bpsArray: BPS[]): GeneralFuelData => {
    const teleShifts = [
        ...scoutingForm.tele.shifts,
        scoutingForm.tele.endgameShift,
        scoutingForm.tele.transitionShift
    ];
    const fullGameShifts = [
        ...teleShifts,
        scoutingForm.auto,
    ];
    const bindcalcShiftFuel = calculateFuelStatisticsOfShift.bind(null, scoutingForm.match, bpsArray);
    const autoFuel = bindcalcShiftFuel([scoutingForm.auto]);
    const teleFuel = bindcalcShiftFuel(teleShifts);
    const fullGameFuel = bindcalcShiftFuel(fullGameShifts);
    return { 
        fullGame: fullGameFuel, 
        auto: autoFuel, 
        tele: teleFuel 
    };
}