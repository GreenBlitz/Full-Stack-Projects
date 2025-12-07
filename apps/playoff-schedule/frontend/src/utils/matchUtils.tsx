// בס"ד
import type { MatchesSimpleType } from "../endpoints/MatchSimple";

const millisecToSec = 1000;
const startIndex = 0;
const endIndex = 2;

export const findNextMatches = (allMatches: MatchesSimpleType[]): MatchesSimpleType[] => {
const currentTime = Math.floor(Date.now() / millisecToSec); 

const futureMatches = allMatches.filter(match => {
    if (match.actual_time !== null && match.actual_time < currentTime) {
        return false; 
}
    if (match.predicted_time === null) {
        return false;
}
    return true;
});

  futureMatches.sort((a, b) => {
    return a.predicted_time! - b.predicted_time!;
});
return futureMatches.slice(startIndex, endIndex);
};