// בס"ד
import { useRef, useEffect, useCallback, useState } from "react";
import type { RefObject } from "react";
import type { Point } from "../../../../../../packages/scouting_types/rebuilt";
import h337 from "heatmap.js";
import { HEAT_STYLE, HEAT_VALUES, LAYOUT, mapHeatPoints, type HeatmapInstance } from "./HeatMapUtils";

export interface UseHeatMapResult {
  heatmapLayerRef: RefObject<HTMLDivElement | null>;
  imgRef: RefObject<HTMLImageElement | null>;
  fallbackPoints: { x: number; y: number }[];
  handleImageLoad: () => void;
  radius: number;
  overlaySize: { width: number; height: number };
}

export const useHeatMap = (
  positions: Point[],
  path: string,
  aspectRatio: number,
): UseHeatMapResult => {
  const heatmapLayerRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HeatmapInstance | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [fallbackPoints, setFallbackPoints] = useState<{ x: number; y: number }[]>([]);
  const [overlaySize, setOverlaySize] = useState<{ width: number; height: number }>({
    width: LAYOUT.zeroSize,
    height: LAYOUT.zeroSize,
  });
  const READY_IMAGE_SIZE = LAYOUT.zeroSize;

  const ensureCanvasSizedAndOnTop = useCallback(() => {
    const instance = heatmapRef.current;
    const layer = heatmapLayerRef.current;
    if (!instance || !layer) {
      return;
    }

    const w = Math.round(layer.clientWidth);
    const h = Math.round(layer.clientHeight);
    if (w <= LAYOUT.zeroSize || h <= LAYOUT.zeroSize) {
      return;
    }

    const renderer = instance._renderer;
    if (renderer?.setDimensions) {
      renderer.setDimensions(w, h);
    }

    const canvas = renderer?.canvas;
    if (canvas) {
      canvas.style.position = "absolute";
      canvas.style.inset = "0";
      canvas.style.zIndex = "2";
      canvas.style.pointerEvents = "none";
    }
  }, []);

  const updateHeatmap = useCallback(() => {
    const instance = heatmapRef.current;
    const img = imgRef.current;
    const layer = heatmapLayerRef.current;
    if (!instance || !img || !layer) return;

    ensureCanvasSizedAndOnTop();

    const layerRect = layer.getBoundingClientRect();
    const roundedWidth = Math.round(layerRect.width);
    const roundedHeight = Math.round(layerRect.height);
    if (roundedWidth <= LAYOUT.zeroSize || roundedHeight <= LAYOUT.zeroSize) return;
    setOverlaySize((prev) =>
      prev.width === roundedWidth && prev.height === roundedHeight
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
    const maxX = Math.max(LAYOUT.minCoordinate, Math.round(layerRect.width) - LAYOUT.pixelOffset);
    const maxY = Math.max(LAYOUT.minCoordinate, Math.round(layerRect.height) - LAYOUT.pixelOffset);
    const data = mapHeatPoints({
      positions,
      scale,
      offsetX,
      offsetY,
      maxX,
      maxY,
      value: HEAT_VALUES.point,
    });

    setFallbackPoints(data.map((point) => ({ x: point.x, y: point.y })));
    instance.setData({ min: HEAT_VALUES.min, max: HEAT_VALUES.max, data });
    instance.repaint();
  }, [positions, ensureCanvasSizedAndOnTop]);

  useEffect(() => {
    const container = heatmapLayerRef.current;
    if (!container) {
      return undefined;
    }

    heatmapRef.current = h337.create({ container, ...HEAT_STYLE });
    ensureCanvasSizedAndOnTop();
    updateHeatmap();

    return () => {
      container.innerHTML = "";
      heatmapRef.current = null;
    };
  }, [ensureCanvasSizedAndOnTop, updateHeatmap]);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > READY_IMAGE_SIZE) {
      updateHeatmap();
    }
  }, [updateHeatmap, path, aspectRatio]);

  useEffect(() => {
    const layer = heatmapLayerRef.current;
    if (!layer) {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      ensureCanvasSizedAndOnTop();
      updateHeatmap();
    });

    observer.observe(layer);

    return () => {
      observer.disconnect();
    };
  }, [ensureCanvasSizedAndOnTop, updateHeatmap]);

  const handleImageLoad = useCallback(() => {
    ensureCanvasSizedAndOnTop();
    updateHeatmap();
  }, [ensureCanvasSizedAndOnTop, updateHeatmap]);

  return {
    heatmapLayerRef,
    imgRef,
    fallbackPoints,
    handleImageLoad,
    radius: HEAT_STYLE.radius,
    overlaySize,
  };
};
