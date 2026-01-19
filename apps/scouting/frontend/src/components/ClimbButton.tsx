//בס"ד
import type React from "react";
import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import type { ScoutingForm } from "@repo/scouting_types";
import type {ClimbLevel} from "@repo/scouting_types"
//turbo run dev --filter=scouting-frontend --filter=scouting-backend

export const numValueToClimbLevel: Record<number, 

export const ClimbButton: React.FC = () => {
  const [climbSide, setClimbSide] = useState();
  const [climbLevel, setClimbLevel] = useState();
  const [numValue, setNumValue] = useState<number[]>();
  const DEFAULT_VALUE = 0;

  return (
    <>
      <form>
        <Slider.Root
          className="relative flex h-5 w-[200px] touch-none select-none items-center"
          defaultValue={[DEFAULT_VALUE]}
          max={3}
          step={1}
          value={numValue}
          onValueChange={setNumValue}
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
        <p>climb level is: {numValue}</p>
      </form>
    </>
  );
};
