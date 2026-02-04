// בס"ד
import type { FC } from "react";
import { useEffect, useRef } from "react";
import { colorizeHeatmapImageData } from "./HeatMapIntensityColorizer";

interface HeatMapIntensityCanvasProps {
  points: { x: number; y: number }[];
  radius: number;
  width: number;
  height: number;
}

const ZERO = 0;
const ONE = 1;
const TWO = 2;
const OVERLAY_BLUR_PX = 20;
const INTENSITY_GAIN = 1.5;
const SOFTEN_RADIUS_MULTIPLIER = 2;
const MIN_RADIUS_PX = 0.8;
const FULL_CIRCLE = Math.PI * TWO;
const RADIUS_FADE_START = "rgba(0, 0, 0, 1)";
const RADIUS_FADE_END = "rgba(0, 0, 0, 0)";

export const HeatMapIntensityCanvas: FC<HeatMapIntensityCanvasProps> = ({
  points,
  radius,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= ZERO || height <= ZERO) {
      return;
    }

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.clearRect(ZERO, ZERO, canvas.width, canvas.height);
    if (points.length === ZERO) {
      return;
    }

    const offscreen = document.createElement("canvas");
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const offscreenContext = offscreen.getContext("2d");
    if (!offscreenContext) {
      return;
    }

    offscreenContext.clearRect(ZERO, ZERO, offscreen.width, offscreen.height);
    offscreenContext.globalCompositeOperation = "lighter";
    offscreenContext.filter = `blur(${OVERLAY_BLUR_PX}px)`;

    const softenedRadius = Math.max(
      MIN_RADIUS_PX,
      Math.round(radius * SOFTEN_RADIUS_MULTIPLIER),
    );
    points.forEach((point) => {
      const gradient = offscreenContext.createRadialGradient(
        point.x,
        point.y,
        ZERO,
        point.x,
        point.y,
        softenedRadius,
      );
      gradient.addColorStop(ZERO, RADIUS_FADE_START);
      gradient.addColorStop(ONE, RADIUS_FADE_END);
      offscreenContext.fillStyle = gradient;
      offscreenContext.beginPath();
      offscreenContext.arc(point.x, point.y, softenedRadius, ZERO, FULL_CIRCLE);
      offscreenContext.fill();
    });

    offscreenContext.filter = "none";
    const imageData = offscreenContext.getImageData(
      ZERO,
      ZERO,
      offscreen.width,
      offscreen.height,
    );
    colorizeHeatmapImageData(imageData, INTENSITY_GAIN);
    context.putImageData(imageData, ZERO, ZERO);
  }, [points, radius, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
};
