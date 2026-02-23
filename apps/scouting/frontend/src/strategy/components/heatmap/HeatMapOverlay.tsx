// בס"ד
import type { FC } from "react";
import { HeatMapIntensityCanvas } from "./HeatMapIntensityCanvas";

interface HeatMapOverlayProps {
  points: { x: number; y: number }[];
  radius: number;
  width: number;
  height: number;
}

export const HeatMapOverlay: FC<HeatMapOverlayProps> = ({ points, radius, width, height }) => (
  <div className="absolute inset-0 z-[3] pointer-events-none opacity-80">
    <HeatMapIntensityCanvas points={points} radius={radius} width={width} height={height} />
  </div>
);
