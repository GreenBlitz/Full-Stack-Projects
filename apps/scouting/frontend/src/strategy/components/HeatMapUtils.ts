// בס"ד
import type { Point } from "../../../../../../packages/scouting_types/rebuilt";

export interface HeatmapRenderer {
  setDimensions?: (width: number,
     height: number) => void;
  canvas?: HTMLCanvasElement;
}

export interface HeatmapInstance {
  setData: (payload: { min: number;
     max: number;
      data: HeatPoint[]
     }) => void;
  repaint: () => void;
  _renderer?: HeatmapRenderer;
}

export interface HeatPoint {
  x: number;
  y: number;
  value: number;
}

export const LAYOUT = {
  centerDivisor: 2,
  minCoordinate: 0,
  zeroSize: 0,
  pixelOffset: 1,
} as const;

export const HEAT_VALUES = {
  min: 0,
  max: 15,
  point: 12,
} as const;
export const HEAT_STYLE = {
  radius: 35,
  maxOpacity: 0.8,
  minOpacity: 0.1,
  blur: 0.7,
  gradient: {
    0.15: "rgba(0, 255, 255, 0.37)",
    0.35: "rgba(0, 255, 0, 0.6)",
    0.6: "rgba(255, 255, 0, 0.7)",
    0.8: "rgba(255, 165, 0, 0.8)",
    1: "rgba(255, 0, 0, 0.9)",
  },
} as const;

export const clamp = (v: number ,min: number ,max: number):
  number => Math.max(min, Math.min(max, v));

interface MapHeatPointsParams {
  positions: Point[];
  scale: number;
  offsetX: number;
  offsetY: number;
  maxX: number;
  maxY: number;
  value: number;
}

export const mapHeatPoints = ({
  positions,
  scale,
  offsetX,
  offsetY,
  maxX,
  maxY,
  value,
}: 
MapHeatPointsParams): 
HeatPoint[] =>
  positions.map((position) => ({
    x: clamp(Math.round(offsetX + position.x * scale), LAYOUT.minCoordinate, maxX),
    y: clamp(Math.round(offsetY + position.y * scale), LAYOUT.minCoordinate, maxY),
    value,
  }));
