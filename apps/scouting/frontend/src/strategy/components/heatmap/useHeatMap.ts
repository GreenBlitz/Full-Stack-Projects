// בס"ד
import {
  useRef,
  useEffect,
  useCallback,
  useState,
  type RefObject,
} from "react";
import type { Point } from "@repo/scouting_types";
import { HEAT_STYLE, HEAT_VALUES, LAYOUT, mapHeatPoints } from "./HeatMapUtils";

export interface UseHeatMapResult {
  heatmapLayerRef: RefObject<HTMLDivElement | null>;
  imgRef: RefObject<HTMLImageElement | null>;
  fallbackPoints: Point[];
  handleImageLoad: () => void;
  radius: number;
  overlaySize: { width: number; height: number };
}

export const useHeatMap = (
  positions: Point[],
  path: string,
  aspectRatio?: number,
): UseHeatMapResult => {
  const heatmapLayerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const resizeFrameRef = useRef<number | null>(null);
  const [fallbackPoints, setFallbackPoints] = useState<Point[]>([]);
  const [overlaySize, setOverlaySize] = useState<{
    width: number;
    height: number;
  }>({
    width: LAYOUT.zeroSize,
    height: LAYOUT.zeroSize,
  });
  const READY_IMAGE_SIZE = LAYOUT.zeroSize;

  const updateHeatmap = useCallback(() => {
    const img = imgRef.current; //put the img
    const layer = heatmapLayerRef.current; //put the layer
    if (!img || !layer) return; //if the img or the layer is not found, return

    const layerRect = layer.getBoundingClientRect();
    const roundedWidth = Math.round(layerRect.width);
    const roundedHeight = Math.round(layerRect.height);
    if (roundedWidth <= LAYOUT.zeroSize || roundedHeight <= LAYOUT.zeroSize)
      return; //if the width or the height is less than 0, return
    setOverlaySize((prev) =>
      prev.width === roundedWidth && prev.height === roundedHeight //if the width and the height are the same as the rounded width and the rounded height, return the previous size
        ? prev
        : { width: roundedWidth, height: roundedHeight },
    );

    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    if (!img.complete || !nw || !nh) return;

    const scale = Math.min(layerRect.width / nw, layerRect.height / nh);
    const drawnW = nw * scale;
    const drawnH = nh * scale;
    const offsetX = (layerRect.width - drawnW) / LAYOUT.centerDivisor;
    const offsetY = (layerRect.height - drawnH) / LAYOUT.centerDivisor;
    const maxX = Math.max(
      LAYOUT.minCoordinate,
      Math.round(layerRect.width) - LAYOUT.pixelOffset,
    );
    const maxY = Math.max(
      LAYOUT.minCoordinate,
      Math.round(layerRect.height) - LAYOUT.pixelOffset,
    );
    const data = mapHeatPoints({
      positions,
      scale,
      offsetX,
      offsetY,
      maxX,
      maxY,
      value: HEAT_VALUES.point,
    });

    const nextPoints = data.map((point) => ({ x: point.x, y: point.y }));
    setFallbackPoints((prev) =>
      prev.length === nextPoints.length &&
      prev.every(
        (point, index) =>
          point.x === nextPoints[index]?.x && point.y === nextPoints[index]?.y,
      )
        ? prev
        : nextPoints,
    );
  }, [positions]);

  useEffect(() => {
    if (
      imgRef.current?.complete &&
      imgRef.current.naturalWidth > READY_IMAGE_SIZE
    ) {
      updateHeatmap();
    }
  }, [updateHeatmap, path, aspectRatio]);

  useEffect(() => {
    const layer = heatmapLayerRef.current;
    if (!layer) {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      if (resizeFrameRef.current !== null) {
        return;
      }
      resizeFrameRef.current = requestAnimationFrame(() => {
        resizeFrameRef.current = null;
        updateHeatmap();
      });
    });

    observer.observe(layer);

    return () => {
      observer.disconnect();
    };
  }, [updateHeatmap]);

  const handleImageLoad = useCallback(() => {
    updateHeatmap();
  }, [updateHeatmap]);

  useEffect(
    () => () => {
      if (resizeFrameRef.current !== null) {
        cancelAnimationFrame(resizeFrameRef.current);
      }
    },
    [],
  );

  return {
    heatmapLayerRef,
    imgRef,
    fallbackPoints,
    handleImageLoad,
    radius: HEAT_STYLE.radius / Math.sqrt(positions.length),
    overlaySize,
  };
};
