//בס"ד
import type React from "react";
import * as Slider from "@radix-ui/react-slider";
import type {
  TeleClimbLevel,
  TeleClimb,
  AutoClimbTime,
} from "@repo/scouting_types";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

interface ClimbLevelSliderProps {
  isAuto: boolean;
  onClimbLevelChange: (climbLevel: TeleClimbLevel) => void;
  climbLevel: TeleClimbLevel;
  setClimbTimes: Dispatch<SetStateAction<ClimbTime | AutoClimbTime>>;
  originTime: number;
  climbTimes: ClimbTime | AutoClimbTime;
  submitClimbLevelAndTime: (
    climbLevel: TeleClimbLevel,
    climbTimes: ClimbTime | AutoClimbTime,
    isAuto: boolean,
  ) => void;
}

export const numValueToClimbLevel: Record<number, TeleClimbLevel> = {
  0: "L0",
  1: "L1",
  2: "L2",
  3: "L3",
};

type TeleopPossibleLevelNum = 0 | 1 | 2 | 3;
type AutoPossibleLevelNum = 0 | 1;

type ClimbTime = TeleClimb["climbTime"];

export const ClimbLevelSlider: React.FC<ClimbLevelSliderProps> = ({
  isAuto,
  onClimbLevelChange,
  climbLevel,
  setClimbTimes,
  originTime,
  climbTimes,
  submitClimbLevelAndTime,
}) => {
  const NO_CLIMB_INDEX = 0;
  const NO_CLIMB_LEVEL = 0;

  const AUTO_NUMBER_OF_CLIMB_LEVELS = 1;
  const TELEOP_NUMBER_OF_CLIMB_LEVELS = 3;
  const NUMBER_OF_CLIMB_LEVELS = isAuto
    ? AUTO_NUMBER_OF_CLIMB_LEVELS
    : TELEOP_NUMBER_OF_CLIMB_LEVELS;

  const startTimeRef = useRef<number | null>(null);
  const lastLevelRef = useRef<TeleopPossibleLevelNum | AutoPossibleLevelNum>(
    NO_CLIMB_INDEX,
  );
  const absoluteStartTimeRef = useRef<number | null>(null);

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    startTimeRef.current = Date.now() - originTime;
  }, []);

  useEffect(() => {
    if (!isDisabled) {
      submitClimbLevelAndTime(climbLevel, climbTimes, isAuto);
    }
  }, [climbLevel, isDisabled]);

  const handleValueChange = (
    newVal: AutoPossibleLevelNum[] | TeleopPossibleLevelNum[],
  ) => {
    const [enteringLevelNum] = newVal;
    const leavingLevelNum = lastLevelRef.current;
    const now = Date.now() - originTime;

    const enteringLevel: TeleClimbLevel = `L${enteringLevelNum}`;

    if (enteringLevelNum === leavingLevelNum && startTimeRef.current === null) {
      return;
    }

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

    if (
      enteringLevelNum < leavingLevelNum &&
      leavingLevelNum !== NO_CLIMB_LEVEL
    ) {
      const leavingLevel: TeleClimbLevel = `L${leavingLevelNum}`;
      setClimbTimes((prev) => ({ ...prev, [leavingLevel]: null }));

      const timesRecord = climbTimes as Record<
        string,
        { start: number; end: number } | null
      >;

      startTimeRef.current =
        enteringLevelNum !== NO_CLIMB_LEVEL
          ? (timesRecord[`L${enteringLevelNum}`]?.end ??
            absoluteStartTimeRef.current)
          : absoluteStartTimeRef.current;
    }

    lastLevelRef.current = enteringLevelNum;
    onClimbLevelChange(numValueToClimbLevel[newVal[NO_CLIMB_INDEX]]);
  };
  const handleStartClimb = () => {
    absoluteStartTimeRef.current = startTimeRef.current =
      Date.now() - originTime;

    setIsDisabled(false);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-row items-stretch gap-3 h-[160px]">
          <div className="flex flex-col justify-between py-1 text-right min-w-[28px] font-black text-slate-100 text-[10px] uppercase pointer-events-none">
            {!isAuto && (
              <>
                <span>L3</span>
                <span>L2</span>
              </>
            )}
            <span>L1</span>

            <span className="text-md">—</span>
          </div>
          <Slider.Root
            className={`relative flex flex-col items-center w-16 h-full transition-opacity touch-none ${
              isDisabled ? "opacity-30" : "opacity-100 cursor-pointer"
            }`}
            orientation="vertical"
            max={NUMBER_OF_CLIMB_LEVELS}
            onValueChange={handleValueChange}
            disabled={isDisabled}
          >
            <Slider.Track className="bg-white/10 relative grow w-2.5 rounded-full border border-white/20">
              <Slider.Range className="absolute w-full bg-emerald-400" />
            </Slider.Track>

            <Slider.Thumb
              className="relative block w-7 h-7 bg-white rounded-full outline-none border-[3px] border-emerald-400
               before:content-[''] before:absolute before:top-1/2 before:left-1/2 
               before:-translate-x-1/2 before:-translate-y-1/2 
               before:w-16 before:h-16 before:rounded-full"
            />
          </Slider.Root>
        </div>
        <button
          type="button"
          onClick={handleStartClimb}
          disabled={!isDisabled}
          className={`w-32 py-2.5 rounded-xl font-black uppercase tracking-wider transition-all text-[11px] border-2 ${
            isDisabled
              ? "bg-emerald-500 text-slate-900 border-emerald-300"
              : "bg-white/5 text-slate-500 border-white/10 opacity-60"
          }`}
        >
          {isDisabled ? "Start Climb" : "Climbing..."}
        </button>
      </div>
    </>
  );
};
