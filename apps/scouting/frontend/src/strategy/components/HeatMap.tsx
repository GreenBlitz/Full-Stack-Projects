// בס"ד
import type { FC } from "react";
import { useRef, useEffect, useCallback } from "react";
import type { Point } from "../../../../../../packages/scouting_types/rebuilt";
import h337 from "heatmap.js";

interface HeatMapProps {
  positions: Point[];
  path: string;
  aspectRatio: number;
}

const MIN_HEATMAP_VALUE = 1;
const MAX_HEATMAP_VALUE = 50;
const CENTER_DIVISOR = 2;
const MIN_COORDINATE = 0;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export const HeatMap: FC<HeatMapProps> = ({ positions, path, aspectRatio }) => {
  const heatmapLayerRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<ReturnType<typeof h337.create> | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const updateHeatmap = useCallback(() => {
    const instance = heatmapRef.current;
    const img = imgRef.current;
    const layer = heatmapLayerRef.current;
    if (!instance || !img || !layer) return;

    const layerRect = layer.getBoundingClientRect();
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    if (!nw || !nh || !layerRect.width || !layerRect.height) return;

    const scale = Math.min(layerRect.width / nw, layerRect.height / nh);
    const drawnW = nw * scale;
    const drawnH = nh * scale;

    const offsetX = (layerRect.width - drawnW) / CENTER_DIVISOR;
    const offsetY = (layerRect.height - drawnH) / CENTER_DIVISOR;

    const mapped = positions.map((p) => {
      const x = Math.round(offsetX + p.x * scale);
      const y = Math.round(offsetY + p.y * scale);
      return {
        x: clamp(x, MIN_COORDINATE, Math.round(layerRect.width)),
        y: clamp(y, MIN_COORDINATE, Math.round(layerRect.height)),
        value: 1,
      };
    });

    instance.setData({
      min: MIN_COORDINATE,
      max: Math.max(MIN_HEATMAP_VALUE, Math.min(MAX_HEATMAP_VALUE, positions.length)),
      data: mapped,
    });
  }, [positions]);

  useEffect(() => {
    if (heatmapLayerRef.current) {
      heatmapRef.current = h337.create({
        container: heatmapLayerRef.current,
        radius: 10,
        opacity: 0.5,
        blur: 10,
      });
    }

    return () => {
      if (heatmapLayerRef.current) {
        heatmapLayerRef.current.innerHTML = "";
      }
      heatmapRef.current = null;
    };
  }, []);

  useEffect(() => {
    updateHeatmap();
  }, [updateHeatmap, path, aspectRatio]);

  useEffect(() => {
    const layer = heatmapLayerRef.current;
    if (!layer) return undefined;

    const observer = new ResizeObserver(() => {
      updateHeatmap();
    });
    observer.observe(layer);

    return function cleanup() {
      observer.disconnect();
    };
  }, [updateHeatmap]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <img
        ref={imgRef}
        src={path}
        alt="Field Map"
        onLoad={updateHeatmap}
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
        }}
      />
    </div>
  );
};
