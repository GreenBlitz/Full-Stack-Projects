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
  climbTimes: ClimbTime;
  climbLevel: ClimbLevel;
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
  climbTimes,
}) => {
  const FIRST_INDEX = 0;
  const INVALID_CLIMB_LEVEL = 0;

  const startTimeRef = useRef<number | null>(null);
  const lastLevelRef = useRef<PossibleLevel>(FIRST_INDEX);

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

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
    setIsDisabled(false);
  };

  const getTime = (ms: number | undefined) =>
    ms ? new Date(ms).toLocaleTimeString() : "N/A";

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
        {isDisabled ? "🚀 Start Climb" : "Recording..."}
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
          defaultValue={[FIRST_INDEX]}
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
