//בס"ד
import type React from "react";
import * as Slider from "@radix-ui/react-slider";
import type { ClimbLevel, Climb } from "@repo/scouting_types";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

interface ClimbLevelSliderProps {
  isAuto: boolean;
  onClimbLevelChange: (climbLevel: ClimbLevel) => void;
  setClimbTimes: Dispatch<SetStateAction<ClimbTime | AutoClimbTime>>;
  originTime: number;
  climbTimes: ClimbTime | AutoClimbTime;
}

export const numValueToClimbLevel: Record<number, ClimbLevel> = {
  0: "L0",
  1: "L1",
  2: "L2",
  3: "L3",
};

type TeleopPossibleLevelNum = 0 | 1 | 2 | 3;
type AutoPossibleLevelNum = 0 | 1;

type ClimbTime = Climb["climbTime"];
type AutoClimbTime = Pick<ClimbTime, "L1">;

export const ClimbLevelSlider: React.FC<ClimbLevelSliderProps> = ({
  isAuto,
  onClimbLevelChange,
  setClimbTimes,
  originTime,
  climbTimes,
}) => {
  const NO_CLIMB_INDEX = 0;
  const NO_CLIMB_LEVEL = 0;

  const AUTO_NUMBER_OF_CLIMB_LEVELS = 1;
  const TELEOP_NUMBER_OF_CLIMB_LEVELS = 3;
  const NUMBER_OF_CLIMB_LEVELS = isAuto
    ? AUTO_NUMBER_OF_CLIMB_LEVELS
    : TELEOP_NUMBER_OF_CLIMB_LEVELS;

  const CLIMB_LEVEL_STEP = 1;

  const startTimeRef = useRef<number | null>(null);
  const lastLevelRef = useRef<TeleopPossibleLevelNum | AutoPossibleLevelNum>(
    NO_CLIMB_INDEX,
  );
  const absoluteStartTimeRef = useRef<number | null>(null);

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    startTimeRef.current = Date.now() - originTime;
  }, []);

  const handleValueChange = (
    newVal: AutoPossibleLevelNum[] | TeleopPossibleLevelNum[],
  ) => {
    const [enteringLevelNum] = newVal;
    const leavingLevelNum = lastLevelRef.current;
    const now = Date.now() - originTime;

    const enteringLevel: ClimbLevel = `L${enteringLevelNum}`;

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
      const leavingLevel: ClimbLevel = `L${leavingLevelNum}`;
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
            {!isAuto && (
              <>
                <span>L3</span>
                <span>L2</span>
              </>
            )}
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
            max={NUMBER_OF_CLIMB_LEVELS}
            step={CLIMB_LEVEL_STEP}
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
    </>
  );
};
