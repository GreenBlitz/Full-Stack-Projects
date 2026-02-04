// בס"ד
import type { FC } from "react";
import { useEffect, useRef } from "react";
import { colorizeHeatmapImageData } from "./HeatMapIntensityColorizer";
import type { Point } from "@repo/scouting_types";
import { isEmpty } from "@repo/array-functions";

interface HeatMapIntensityCanvasProps {
  points: Point[];
  radius: number;
  width: number;
  height: number;
}

const boundaryBeginning = 0;
const OFFSET_AMOUNT = 1;
const HALF_CIRCLE = 2;
const OVERLAY_BLUR_PX = 20;
const INTENSITY_GAIN = 1.5;
const SOFTEN_RADIUS_MULTIPLIER = 2;
const MIN_RADIUS_PX = 0.8;
const FULL_CIRCLE_PERIMETER = Math.PI * HALF_CIRCLE;
const RADIUS_FADE_START = "#000000";
const RADIUS_FADE_END = "#00000000";

const ensureCanvasSize = (canvas: HTMLCanvasElement, width: number, height: number): void => {
  canvas.width = width;
  canvas.height = height;
};

const clearCanvas = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
): void => {
  context.clearRect(boundaryBeginning, boundaryBeginning, width, height);
};

const createOffscreenContext = (
  width: number,
  height: number,
): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } | null => {
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;
  const context = offscreen.getContext("2d");
  if (!context) {
    return null;
  }
  return { canvas: offscreen, context };
};

const drawIntensityField = (
  context: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  radius: number,
): void => {
  clearCanvas(context, context.canvas.width, context.canvas.height);
  context.globalCompositeOperation = "lighter";
  context.filter = `blur(${OVERLAY_BLUR_PX}px)`;

  const softenedRadius = Math.max(
    MIN_RADIUS_PX,
    Math.round(radius * SOFTEN_RADIUS_MULTIPLIER),
  );
  points.forEach((point) => {
    const gradient = context.createRadialGradient(
      point.x,
      point.y,
      boundaryBeginning,
      point.x,
      point.y,
      softenedRadius,
    );
    gradient.addColorStop(boundaryBeginning, RADIUS_FADE_START);
    gradient.addColorStop(OFFSET_AMOUNT, RADIUS_FADE_END);
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(point.x, point.y, softenedRadius, boundaryBeginning, FULL_CIRCLE_PERIMETER);
    context.fill();
  });
  context.filter = "none";
};

export const HeatMapIntensityCanvas: FC<HeatMapIntensityCanvasProps> = ({
  points,
  radius,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= boundaryBeginning || height <= boundaryBeginning) {
      return;
    }
    ensureCanvasSize(canvas, width, height);
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    clearCanvas(context, canvas.width, canvas.height);
    if (isEmpty(points)) {
      return;
    }

    const offscreenPayload = createOffscreenContext(canvas.width, canvas.height);
    if (!offscreenPayload) {
      return;
    }

    const offscreenContext = offscreenPayload.context;
    drawIntensityField(offscreenContext, points, radius);
    const imageData = offscreenContext.getImageData(
      boundaryBeginning,
      boundaryBeginning,
      offscreenPayload.canvas.width,
      offscreenPayload.canvas.height,
    );
    colorizeHeatmapImageData(imageData, INTENSITY_GAIN);
    context.putImageData(imageData, boundaryBeginning, boundaryBeginning);
  }, [points, radius, width, height]);

  return (
    <canvas ref={canvasRef} className="block h-full w-full" />
  );
};
