// בס"ד
import { useMemo } from "react";
import type { MatchesSimpleType } from "../endpoints/MatchSimple";
import { sortMatches, getMatchTime } from "../utils/matchUtils";
import {
  targetTeamKey,
  timeMultiplier,
  matchTimeMissing,
  dayInSeconds,
  firstIndex,
  nextMatchLimit,
  noGap,
} from "../config/frcConfig";

interface UseMatchProcessingReturn {
  currentGlobalMatch: MatchesSimpleType | undefined;
  targetTeamMatches: MatchesSimpleType[];
  futureMatches: MatchesSimpleType[];
  isEventOver: boolean;
  isTeamDone: boolean;
  isFutureEvent: boolean;
}

export const useMatchProcessing = (
  allMatches: MatchesSimpleType[]
): UseMatchProcessingReturn => {
  return useMemo(() => {
    // i will leave this here so you can check the code with different dates.

    // normal one
    const currentTimeSecs = Math.floor(Date.now() / timeMultiplier);

    // testing 2025isios
    // const currentTimeSecs = Math.floor(
    //   new Date("2025-10-08T13:44:00").getTime() / timeMultiplier
    // );

    // testing 2025iscmp
    // const currentTimeSecs = Math.floor(
    //   new Date("2025-03-27T10:00:00").getTime() / timeMultiplier
    // );

    // testing 2024iscmp
    // const currentTimeSecs = Math.floor(
    // new Date("2024-03-21T15:00:00").getTime() / timeMultiplier
    // );

    // testing 2025cmptx
    //const currentTimeSecs = Math.floor(new Date("2025-04-19T10:00:00").getTime() / timeMultiplier);

    const futureMatchesArr = allMatches.filter((match) => {
      const time = getMatchTime(match);
      return time === matchTimeMissing || time > currentTimeSecs;
    });

    const pastMatchesArr = allMatches.filter((match) => {
      const time = getMatchTime(match);
      return time > matchTimeMissing && time <= currentTimeSecs;
    });

    futureMatchesArr.sort(sortMatches);

    const currentMatch =
      futureMatchesArr.length > noGap
        ? futureMatchesArr[firstIndex]
        : undefined;

    const teamFutureMatches = futureMatchesArr.filter(
      (match) =>
        match.alliances.blue.team_keys.includes(targetTeamKey) ||
        match.alliances.red.team_keys.includes(targetTeamKey)
    );

    const teamPastMatches = pastMatchesArr.filter(
      (match) =>
        match.alliances.blue.team_keys.includes(targetTeamKey) ||
        match.alliances.red.team_keys.includes(targetTeamKey)
    );

    const hasEventEnded =
      futureMatchesArr.length === noGap && allMatches.length > noGap;

    const hasTeamDone =
      !hasEventEnded &&
      teamFutureMatches.length === noGap &&
      teamPastMatches.length > noGap;

    const isNextMatchInFarFuture = currentMatch
      ? getMatchTime(currentMatch) > currentTimeSecs + dayInSeconds &&
        getMatchTime(currentMatch) !== matchTimeMissing
      : false;

    return {
      currentGlobalMatch: currentMatch,
      targetTeamMatches: hasTeamDone
        ? []
        : teamFutureMatches.slice(firstIndex, nextMatchLimit),
      futureMatches: futureMatchesArr,
      isEventOver: hasEventEnded,
      isTeamDone: hasTeamDone,
      isFutureEvent: isNextMatchInFarFuture,
    };
  }, [allMatches]);
};
