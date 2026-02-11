// בס"ד

import { calculateMedian, isEmpty } from "@repo/array-functions";
import type { Interval, TeamData, TeleClimb } from "@repo/scouting_types";
import type { PointDataset } from "./Dataset";

const MILLISECONDS_TO_SECONDS = 1000;
const DEFAULT_MEDIAN_CLIMB_TIME = 0;
const calculateMedianClimbTimes = (times: (Interval | null)[]): number => {
  const relevantTimes = times.filter((time) => time !== null);

  const climbDurations = relevantTimes.map(({ start, end }) => end - start);
  const climbDurationsSeconds = climbDurations.map(
    (time) => time / MILLISECONDS_TO_SECONDS,
  );

  if (isEmpty(climbDurationsSeconds)) {
    return DEFAULT_MEDIAN_CLIMB_TIME;
  }

  return calculateMedian(climbDurationsSeconds, (time) => time);
};

const mapToTotalInterval = (
  climbTime: TeleClimb["climbTime"],
  level: keyof TeleClimb["climbTime"],
) => {
  if (level === "L1") {
    return climbTime.L1;
  }
  if (!climbTime.L1 || !climbTime.L2) {
    return null;
  }
  const level2 = {
    start: climbTime.L1.start + climbTime.L2.start,
    end: climbTime.L1.end + climbTime.L2.end,
  };
  if (level === "L2") {
    return level2;
  }
  if (!climbTime.L3) {
    return null;
  }
  return {
    start: level2.start + climbTime.L3.start,
    end: level2.end + climbTime.L3.end,
  };
};

export const calculateMedianClimbs = (
  data: TeamData["auto" | "tele"],
  phase: "tele" | "auto" | "fullGame",
) => ({
  L1: calculateMedianClimbTimes(data.climbs.map((climb) => climb.climbTime.L1)),
  ...(phase === "tele"
    ? {
        L2: calculateMedianClimbTimes(
          data.climbs.map((climb) =>
            "L2" in climb.climbTime
              ? mapToTotalInterval(climb.climbTime, "L2")
              : null,
          ),
        ),
        L3: calculateMedianClimbTimes(
          data.climbs.map((climb) =>
            "L3" in climb.climbTime
              ? mapToTotalInterval(climb.climbTime, "L3")
              : null,
          ),
        ),
      }
    : {}),
});

const CLIMB_LEVEL_LEVEL_CHARACTER = 1;
const FIRST_MATCH_TYPE_CHARACTER = 0;

export const getClimbDataset = (
  data: TeamData["auto" | "tele"],
): PointDataset<string | number>["points"] =>
  Object.fromEntries(
    data.climbs.map((climb) => [
      climb.match.type[FIRST_MATCH_TYPE_CHARACTER] + climb.match.number,
      {
        value: Number(climb.level[CLIMB_LEVEL_LEVEL_CHARACTER]),
        pointStyle: climb.climbSide.middle
          ? "dash"
          : climb.climbSide.side
            ? "star"
            : climb.climbSide.support
              ? "triangle"
              : "dash",
      },
    ]),
  );
