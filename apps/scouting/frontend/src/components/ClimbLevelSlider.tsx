//בס"ד
import type React from "react";
import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import type { ClimbLevel } from "../../../../../packages/scouting_types/rebuilt/Shift";
//turbo run dev --filter=scouting-frontend --filter=scouting-backend

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
    <>
      <form>
        <Slider.Root
          className="relative flex h-5 w-[200px] touch-none select-none items-center"
          defaultValue={[DEFAULT_VALUE]}
          max={3}
          step={1}
          onValueChange={(newVal) => {
            const newLevel = numValueToClimbLevel[newVal[DEFAULT_VALUE]];
            onClimbLevelChange(newLevel);
          }}
        >
          <Slider.Track
            className="bg-gray-200 relative grow h-1 rounded-full"
            aria-label="climb level"
          >
            <Slider.Range className="absolute h-full rounded-full bg-gray-400" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-5 h-5 bg-green-600 rounded-full shadow-lg cursor-pointer"
            aria-label="Volume"
          />
        </Slider.Root>
      </form>
    </>
  );
};
