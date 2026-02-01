// בס"ד
import type { BPS } from "./fuel-object";
import { createFuelObject } from "./fuel-object";
import type { ScoutingForm, ShootEvent } from "@repo/scouting_types";
interface   ShiftFuel {
    scored: number;
    missed: number;
    shot: number;
}
interface GeneralFuelData {
    fullGame:ShiftFuel;
    auto:ShiftFuel;
    tele:ShiftFuel;
}

const calculateShiftFuel = (shifts: { 
    shootEvents: ShootEvent[] 
    }[], match: ScoutingForm["match"],
    bpsArray: BPS[]): ShiftFuel => {
    const fuelObjects = shifts
        .flatMap(shift => shift.shootEvents)
        .map(event => createFuelObject(event, match, bpsArray));
    
    return fuelObjects.reduce((acc, fuelObject) => ({
        scored: acc.scored + fuelObject.scored,
        missed: acc.missed + fuelObject.missed,
        shot: acc.shot + fuelObject.shot
    }), { scored: 0, missed: 0, shot: 0 });
}

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
    const bindcalcShiftFuel = (shifts: { shootEvents: ShootEvent[] }[]) => calculateShiftFuel(shifts, scoutingForm.match, bpsArray);
    const autoFuel = bindcalcShiftFuel([scoutingForm.auto]);
    const teleFuel = bindcalcShiftFuel(teleShifts);
    const fullGameFuel = bindcalcShiftFuel(fullGameShifts);
    return { 
        fullGame: fullGameFuel, 
        auto: autoFuel, 
        tele: teleFuel 
    };
}