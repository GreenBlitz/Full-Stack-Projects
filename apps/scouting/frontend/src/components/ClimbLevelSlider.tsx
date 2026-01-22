//בס"ד
import type React from "react";
import * as Slider from "@radix-ui/react-slider";
import type {
  ClimbLevel,
  Climb,
  ActiveClimbLevel,
} from "../../../../../packages/scouting_types/rebuilt/Shift";
import { useEffect, useRef, useState } from "react";

interface ClimbLevelSliderProps {
  onClimbLevelChange: (climbLevel: ClimbLevel) => void;
  setClimbTimes: React.Dispatch<React.SetStateAction<ClimbTime>>;
  climbLevel: ClimbLevel;
  climbTimes: ClimbTime;
}

export const numValueToClimbLevel: Record<number, ClimbLevel> = {
  0: "none",
  1: "L1",
  2: "L2",
  3: "L3",
};

type PossibleLevel = 0 | 1 | 2 | 3;

type ClimbTime = Climb["climbTime"];

export const ClimbLevelSlider: React.FC<ClimbLevelSliderProps> = ({
  onClimbLevelChange,
  setClimbTimes,
}) => {
  const FIRST_INDEX = 0;
  const INVALID_CLIMB_LEVEL = 0;

  const startTimeRef = useRef<number | null>(null);
  const lastLevelRef = useRef<PossibleLevel>(FIRST_INDEX);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const handleValueChange = (newVal: PossibleLevel[]) => {
    const [nextLevelNum] = newVal;
    const prevLevelNum = lastLevelRef.current;
    const now = Date.now();

    if (nextLevelNum !== prevLevelNum && startTimeRef.current !== null) {
      if (nextLevelNum > prevLevelNum && nextLevelNum !== INVALID_CLIMB_LEVEL) {
        const newEntryLevel: ActiveClimbLevel = `L${nextLevelNum}`;

        setClimbTimes((prev) => ({
          ...prev,
          [newEntryLevel]: {
            start: startTimeRef.current,
            end: now,
          },
        }));
      } else if (nextLevelNum < prevLevelNum) {
        if (nextLevelNum !== INVALID_CLIMB_LEVEL) {
          const enteringLevel: ActiveClimbLevel = `L${nextLevelNum}`;

          setClimbTimes((prev) => ({
            ...prev,
            [enteringLevel]: prev[enteringLevel]
              ? { ...prev[enteringLevel], end: now }
              : { start: startTimeRef.current, end: now },
          }));
        }
        if (prevLevelNum !== INVALID_CLIMB_LEVEL) {
          const leavingLevel: ActiveClimbLevel = `L${prevLevelNum}`;
          setClimbTimes((prev) => ({ ...prev, [leavingLevel]: null }));
        }
      }
      startTimeRef.current = now;
      lastLevelRef.current = nextLevelNum;
      onClimbLevelChange(numValueToClimbLevel[newVal[FIRST_INDEX]]);
    }
  };
  const handleStartClimb = () => {
    startTimeRef.current = Date.now();
  };

  return (
    //to do - make it so the user does not have to manually press a button for the timer to start
    //to do - make it prettier
    <form>
      <button type="button" onClick={handleStartClimb}>
        start climb
      </button>
      <Slider.Root
        className="relative flex flex-col items-center select-none touch-none w-5 h-[200px]"
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
    </form>
  );
};
