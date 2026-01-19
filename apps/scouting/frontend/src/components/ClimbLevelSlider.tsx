//בס"ד
import type React from "react";
import * as Slider from "@radix-ui/react-slider";
import type { ClimbLevel } from "../../../../../packages/scouting_types/rebuilt/Shift";

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

export const ClimbLevelSlider: React.FC<ClimbLevelSliderProps> = ({
  onClimbLevelChange,
  climbLevel,
}) => {
  const DEFAULT_VALUE = 0;

  return (
    <form>
      <Slider.Root
        className="relative flex flex-col items-center select-none touch-none w-5 h-[200px]" // Swapped width and height
        orientation="vertical"
        defaultValue={[DEFAULT_VALUE]}
        max={3}
        step={1}
        onValueChange={(newVal) => {
          onClimbLevelChange(numValueToClimbLevel[newVal[DEFAULT_VALUE]]);
        }}
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
