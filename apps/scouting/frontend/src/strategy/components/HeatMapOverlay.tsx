// בס"ד
import type { FC } from "react";
import { HeatMapIntensityCanvas } from "./HeatMapIntensityCanvas";

interface HeatMapOverlayProps {
  points: { x: number; y: number }[];
  radius: number;
  width: number;
  height: number;
}

const OVERLAY_Z_INDEX = 3;
const OVERLAY_OPACITY = 0.8;

export const HeatMapOverlay: FC<HeatMapOverlayProps> = ({ points, radius, width, height }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      zIndex: OVERLAY_Z_INDEX,
      pointerEvents: "none",
      opacity: OVERLAY_OPACITY,
    }}
  >
    <HeatMapIntensityCanvas points={points} radius={radius} width={width} height={height} />
  </div>
);
