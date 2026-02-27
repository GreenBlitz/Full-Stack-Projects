// בס"ד
import type { FC } from "react";
import type { Point } from "@repo/scouting_types";
import { HeatMapOverlay } from "./HeatMapOverlay";
import { useHeatMap } from "./useHeatMap";

interface HeatMapProps {
  positions: Point[];
  path: string;
  aspectRatio: number; //width/height
}

export const HeatMap: FC<HeatMapProps> = (heatmap) => {
  const {
    heatmapLayerRef,
    imgRef,
    fallbackPoints,
    handleImageLoad,
    radius,
    overlaySize,
  } = useHeatMap(heatmap.positions, heatmap.path, heatmap.aspectRatio);

  return (
    <div className="relative w-full h-full">
      <img
        ref={imgRef}
        src={heatmap.path}
        alt="Field Map"
        onLoad={handleImageLoad}
        className="absolute inset-0 h-full w-full object-contain z-0"
        style={{ aspectRatio: heatmap.aspectRatio }}
      />

      <div
        ref={heatmapLayerRef}
        className="absolute inset-0 z-[1] h-full w-full pointer-events-none"
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
