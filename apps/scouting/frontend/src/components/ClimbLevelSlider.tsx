//בס"ד
import type React from "react";
import * as Slider from "@radix-ui/react-slider";
import type { ClimbLevel, Climb, ActiveClimbLevel } from "@repo/scouting_types";
import { useEffect, useRef, useState } from "react";

interface ClimbLevelSliderProps {
  onClimbLevelChange: (climbLevel: ClimbLevel) => void;
  setClimbTimes: React.Dispatch<React.SetStateAction<ClimbTime>>;
  originTime: number;
  climbTimes: ClimbTime;
}

export const numValueToClimbLevel: Record<number, ClimbLevel> = {
  0: "none",
  1: "L1",
  2: "L2",
  3: "L3",
};

type PossibleLevelNum = 0 | 1 | 2 | 3;
type PossibleClimbLevel = 0 | "L1" | "L2" | "L3";

type ClimbTime = Climb["climbTime"];

export const ClimbLevelSlider: React.FC<ClimbLevelSliderProps> = ({
  onClimbLevelChange,
  setClimbTimes,
  originTime,
  climbTimes,
}) => {
  const NO_CLIMB_INDEX = 0;
  const NO_CLIMB_LEVEL = 0;

  const startTimeRef = useRef<number | null>(null);
  const lastLevelRef = useRef<PossibleLevelNum>(NO_CLIMB_INDEX);
  const absoluteStartTimeRef = useRef<number | null>(null);

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    startTimeRef.current = Date.now() - originTime;
  }, []);

  const handleValueChange = (newVal: PossibleLevelNum[]) => {
    const [enteringLevelNum] = newVal;
    const leavingLevelNum = lastLevelRef.current;
    const now = Date.now() - originTime;

    if (
      !(enteringLevelNum !== leavingLevelNum && startTimeRef.current !== null)
    ) {
      return;
    }

    const enteringLevel: PossibleClimbLevel =
      enteringLevelNum !== NO_CLIMB_LEVEL
        ? `L${enteringLevelNum}`
        : NO_CLIMB_LEVEL;

    if (enteringLevelNum > leavingLevelNum) {
      setClimbTimes((prev) => ({
        ...prev,
        [enteringLevel]: {
          start: startTimeRef.current,
          end: now,
        },
      }));
      startTimeRef.current = now;
    }

    if (enteringLevelNum < leavingLevelNum) {
      if (leavingLevelNum !== NO_CLIMB_LEVEL) {
        const leavingLevel: ActiveClimbLevel = `L${leavingLevelNum}`;
        setClimbTimes((prev) => ({ ...prev, [leavingLevel]: null }));

        startTimeRef.current =
          enteringLevelNum !== NO_CLIMB_LEVEL
            ? (climbTimes[`L${enteringLevelNum}`]?.end ??
              absoluteStartTimeRef.current)
            : absoluteStartTimeRef.current;
      }
    }

    lastLevelRef.current = enteringLevelNum;
    onClimbLevelChange(numValueToClimbLevel[newVal[NO_CLIMB_INDEX]]);
  };
  const handleStartClimb = () => {
    startTimeRef.current = Date.now() - originTime;
    absoluteStartTimeRef.current = Date.now() - originTime;

    setIsDisabled(false);
  };

  return (
    <form className="flex flex-col items-center gap-6 p-4">
      <button
        type="button"
        onClick={handleStartClimb}
        disabled={!isDisabled}
        className={`px-6 py-2 rounded-full font-bold transition-all ${
          isDisabled
            ? "bg-blue-600 text-black shadow-lg hover:bg-blue-700 active:scale-95"
            : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
        }`}
      >
        {isDisabled ? "Start Climb" : "Climbing..."}
      </button>

      <div className="relative flex flex-col items-center">
        <div className="absolute -left-8 h-full flex flex-col justify-between py-1 text-[10px] font-bold text-gray-400 uppercase pointer-events-none">
          <span>L3</span>
          <span>L2</span>
          <span>L1</span>
          <span>—</span>
        </div>

        <Slider.Root
          className={`relative flex flex-col items-center select-none touch-none w-5 h-[200px] transition-opacity duration-300 ${
            isDisabled
              ? "opacity-30 cursor-not-allowed"
              : "opacity-100 cursor-pointer"
          }`}
          orientation="vertical"
          defaultValue={[NO_CLIMB_INDEX]}
          max={3}
          step={1}
          onValueChange={handleValueChange}
          disabled={isDisabled}
        >
          <Slider.Track className="bg-gray-200 relative grow w-2 rounded-full border border-gray-300">
            <Slider.Range
              className={`absolute w-full rounded-full transition-colors ${
                isDisabled ? "bg-gray-400" : "bg-green-400"
              }`}
            />
          </Slider.Track>

          <Slider.Thumb
            className={`block w-6 h-6 rounded-full shadow-xl transition-all outline-none ${
              isDisabled
                ? "bg-gray-400 border-2 border-gray-300"
                : "bg-green-600 border-2 border-white hover:scale-110 active:scale-95 ring-2 ring-green-300"
            }`}
            aria-label="Climb Level"
          />
        </Slider.Root>
      </div>
    </form>
  );
};
