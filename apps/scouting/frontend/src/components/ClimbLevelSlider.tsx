//בס"ד
import type React from "react";
import * as Slider from "@radix-ui/react-slider";
import type {
  ClimbLevel,
  Climb,
} from "../../../../../packages/scouting_types/rebuilt/Shift";
import { useEffect, useRef, useState } from "react";

interface ClimbLevelSliderProps {
  onClimbLevelChange: (climbLevel: ClimbLevel) => void;
  climbLevel: ClimbLevel;
}

export const numValueToClimbLevel: Record<number, ClimbLevel> = {
  0: "none",
  1: "L1",
  2: "L2",
  3: "L3",
};

interface LevelTimeEntrie {
  startLevel: number;
  endLevel: number;
  startTime: number;
  endTime: number;
}

type ClimbTime = Climb["climbTime"];

export const ClimbLevelSlider: React.FC<ClimbLevelSliderProps> = ({
  onClimbLevelChange,
  climbLevel,
}) => {
  const FIRST_INDEX = 0;
  const SECOND_IN_MILI_SECONDS = 1000;
  const DIGITS_AFTER_DOT = 3;
  const [timeHistory, setTimeHistory] = useState<LevelTimeEntrie[]>([]);
  const [climbTimes, setClimbTimes] = useState<ClimbTime>({
    L1: null,
    L2: null,
    L3: null,
  });

  const startTimeRef = useRef<number | null>(null);
  const lastLevelRef = useRef<number>(FIRST_INDEX);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const handleValueChange = (newVal: number[]) => {
    const [nextLevel] = newVal;
    const prevLevel = lastLevelRef.current;
    const now = Date.now();

    if (nextLevel !== prevLevel) {
      if (startTimeRef.current !== null) {
        const entry: LevelTimeEntrie = {
          startLevel: prevLevel,
          endLevel: nextLevel,
          startTime: startTimeRef.current,
          endTime: Date.now(),
        };

        setTimeHistory((prev) => [...prev, entry]);

        setClimbTimes((prev) => ({
          ...prev,
          [`L${entry.endLevel}`]: {
            start: entry.startTime,
            end: entry.endTime,
          },
        }));
      }

      startTimeRef.current = now;
      lastLevelRef.current = nextLevel;
      onClimbLevelChange(numValueToClimbLevel[newVal[FIRST_INDEX]]);
    }
  };

  const handleStartClimb = () => {
    startTimeRef.current = Date.now();
  };

  const getTime = (ms: number | undefined) =>
    ms ? new Date(ms).toLocaleTimeString() : "N/A";

  return (
    <form>
      <button type="button" onClick={handleStartClimb}>
        start climb
      </button>
      <Slider.Root
        className="relative flex flex-col items-center select-none touch-none w-5 h-[200px]" // Swapped width and height
        orientation="vertical"
        defaultValue={[FIRST_INDEX]}
        max={3}
        step={1}
        onValueChange={handleValueChange}
      >
        <Slider.Track className="bg-gray-200 relative grow w-1 rounded-full">
          <Slider.Range className="absolute w-full rounded-full bg-gray-400" />
        </Slider.Track>

        <Slider.Thumb
          className="block w-5 h-5 bg-green-600 rounded-full shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400"
          aria-label="Climb Level"
        />
      </Slider.Root>
      <h5 className="mt-4 text-[10px] text-gray-500">
        Helper Logs:{timeHistory.length}
        {timeHistory.map((c) => {
          return (
            "start level: " +
            c.startLevel +
            " end level: " +
            c.endLevel +
            " start time : " +
            c.startTime +
            " end time: " +
            c.endTime
          );
        })}
      </h5>
      <div className="mt-4 p-4 bg-gray-100 rounded text-xs font-mono">
        <h4 className="font-bold mb-2">Climb Logs:</h4>

        <p>
          L1: {getTime(climbTimes.L1?.start)} → {getTime(climbTimes.L1?.end)}
        </p>
        <p>
          L2: {getTime(climbTimes.L2?.start)} → {getTime(climbTimes.L2?.end)}
        </p>
        <p>
          L3: {getTime(climbTimes.L3?.start)} → {getTime(climbTimes.L3?.end)}
        </p>
      </div>
    </form>
  );
};
