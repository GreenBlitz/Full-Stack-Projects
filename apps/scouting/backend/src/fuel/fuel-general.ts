// בס"ד
import type { BPS } from "./fuel-object";
import { createFuelObject } from "./fuel-object";
import type { ScoutingForm } from "@repo/scouting_types";
import type { ShootEvent } from "@repo/scouting_types"; 
interface   ShiftFuel {
    scored: number;
    missed: number;
    shot: number;
}
interface ReturnFuel {
    fullGameReturn:ShiftFuel;
    autoReturn:ShiftFuel;
    teleReturn:ShiftFuel;
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

export const calculateFuel = (scoutingForm: ScoutingForm, bpsArray: BPS[]): ReturnFuel => {
    const teleShifts = [
        ...scoutingForm.tele.shifts,
        scoutingForm.tele.endgameShift,
        scoutingForm.tele.transitionShift
    ];
    
    const fullGameShifts = [
        ...scoutingForm.tele.shifts,
        scoutingForm.tele.endgameShift,
        scoutingForm.tele.transitionShift,
        scoutingForm.auto,
    ];

    const autoReturn = calculateShiftFuel([scoutingForm.auto], scoutingForm.match, bpsArray);
    const teleReturn = calculateShiftFuel(teleShifts, scoutingForm.match, bpsArray);
    const fullGameReturn = calculateShiftFuel(fullGameShifts, scoutingForm.match, bpsArray);
    return { 
        fullGameReturn, 
        autoReturn, 
        teleReturn 
    };
}