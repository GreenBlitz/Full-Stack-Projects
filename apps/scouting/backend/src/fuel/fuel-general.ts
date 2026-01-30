// בס"ד
import type { BPS } from "./fuel-object";
import { createFuelObject } from "./fuel-object";
import type { ScoutingForm } from "@repo/scouting_types"; 
interface   ReturnShift {
    scored: number;
    missed: number;
    shot: number;
}
export const calculateFuel = (scoutingForm: ScoutingForm, bpsArray: BPS[]): {fullGameReturn:ReturnShift,autoReturn:ReturnShift,teleReturn:ReturnShift} => {
    const fullGameReturn:ReturnShift = {
        scored: 0,
        missed: 0,
        shot: 0
    }
    const autoReturn:ReturnShift = {
        scored: 0,
        missed: 0,
        shot: 0
    }
    const teleReturn:ReturnShift = {
        scored: 0,
        missed: 0,
        shot: 0
    }


    const autoFuelObjects = scoutingForm.auto.shootEvents
        .map(event => createFuelObject(event, scoutingForm.match, bpsArray));

    const teleFuelObjects = [
        ...scoutingForm.tele.shifts,
        scoutingForm.tele.endgameShift,
        scoutingForm.tele.transitionShift
    ].flatMap(shift => shift.shootEvents).map(event => createFuelObject(event, scoutingForm.match, bpsArray));
    const fullGameFuelObjects =
    [
        ...scoutingForm.tele.shifts,
        scoutingForm.tele.endgameShift,
        scoutingForm.tele.transitionShift,
        scoutingForm.auto,
    ]
        .filter(shift => Array.isArray(shift.shootEvents))
        .flatMap(shift => shift.shootEvents)
        .concat(scoutingForm.auto.shootEvents)
        .map(event => createFuelObject(event, scoutingForm.match, bpsArray));

    fullGameFuelObjects.forEach(fuelObject => {
        fullGameReturn.scored += fuelObject.scored;
        fullGameReturn.missed += fuelObject.missed;
        fullGameReturn.shot += fuelObject.shot;
    });
    autoFuelObjects.forEach(fuelObject => {
        autoReturn.scored += fuelObject.scored;
        autoReturn.missed += fuelObject.missed;
        autoReturn.shot += fuelObject.shot;
    });
    teleFuelObjects.forEach(fuelObject => {
        teleReturn.scored += fuelObject.scored;
        teleReturn.missed += fuelObject.missed;
        teleReturn.shot += fuelObject.shot;
    });
    return { fullGameReturn, autoReturn, teleReturn };
}