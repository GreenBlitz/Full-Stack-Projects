//בס"ד
import type React from "react";
import * as Slider from "@radix-ui/react-slider";
import type { ClimbLevel } from "../../../../../packages/scouting_types/rebuilt/Shift";
import { useRef, useState } from "react";

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

interface TimeEntries {
  startLevel: number;
  EndLevel: number;
  duration: string;
  timestamp: string;
}

export const ClimbLevelSlider: React.FC<ClimbLevelSliderProps> = ({
  onClimbLevelChange,
  climbLevel,
}) => {
  const FIRST_INDEX = 0;
  const SECOND_IN_MILI_SECONDS = 1000;
  const DIGITS_AFTER_DOT = 3;
  const [timeHistory, setTimeHistory] = useState<TimeEntries[]>([]);

  const startTimeRef = useRef<number | null>(null);
  const lastLevelRef = useRef<number>(FIRST_INDEX);

  const handleValueChange = (newVal: number[]) => {
    const [nextLevel] = newVal;
    const prevLevel = lastLevelRef.current;
    const now = Date.now();

    if (nextLevel !== prevLevel) {
      // 1. If this is the first move, start the overall timer
      if (startTimeRef.current !== null) {
        const duration = (now - startTimeRef.current) / SECOND_IN_MILI_SECONDS; // in seconds

        // 2. Save the data for the level we just LEFT
        const entry: TimeEntries = {
          startLevel: prevLevel,
          EndLevel: nextLevel,
          duration: duration.toFixed(DIGITS_AFTER_DOT),
          timestamp: new Date().toLocaleTimeString(),
        };

        setTimeHistory((prev) => [...prev, entry]);
      }

      // 3. Reset the timer for the NEW level
      startTimeRef.current = now;
      lastLevelRef.current = nextLevel;
      onClimbLevelChange(numValueToClimbLevel[newVal[FIRST_INDEX]]);
    }
  };

  return (
    <form>
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
        Logs:{timeHistory.length}
        {timeHistory.map((c) => {
          return (
            "start level:" +
            c.startLevel +
            " end level:" +
            c.EndLevel +
            " duration:" +
            c.duration +
            "\n"
          );
        })}
      </h5>
    </form>
  );
};
