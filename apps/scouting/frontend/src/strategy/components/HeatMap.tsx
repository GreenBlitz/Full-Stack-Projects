// בס"ד
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import type { FC } from "react";
import type { Point } from "../../../../../../packages/scouting_types/rebuilt";
import { HeatMapOverlay } from "./HeatMapOverlay";
import { useHeatMap } from "./useHeatMap";

interface HeatMapProps {
  positions: Point[];
  path: string;
  aspectRatio: number;
}

export const HeatMap: FC<HeatMapProps> = ({ positions, path, aspectRatio }) => {
  const { heatmapLayerRef, imgRef, fallbackPoints, handleImageLoad, radius, overlaySize } = useHeatMap(
    positions,
    path,
    aspectRatio,
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
    >
      <img
        ref={imgRef}
        src={path}
        alt="Field Map"
        onLoad={handleImageLoad}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          aspectRatio,
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      />

      <div
        ref={heatmapLayerRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          width: "100%",
          height: "100%",
        }}
      />
      <HeatMapOverlay
        points={fallbackPoints}
        radius={radius}
        width={overlaySize.width}
        height={overlaySize.height}
      />
    </div>
  );
};
