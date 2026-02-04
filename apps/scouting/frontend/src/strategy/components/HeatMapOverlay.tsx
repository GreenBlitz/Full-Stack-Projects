// בס"ד
import type { FC } from "react";

import { useEffect, useRef } from "react";

interface HeatMapOverlayProps {
  points: { x: number; y: number }[];
  radius: number;
  width: number;
  height: number;
}

const ZERO = 0;
const TWO = 2;
const OVERLAY_Z_INDEX = 3;
const OVERLAY_OPACITY = 0.8;
const OVERLAY_BLUR_PX = 10;
const FULL_CIRCLE = Math.PI * TWO;

const GRADIENT_STOP_START = 0;
const GRADIENT_STOP_MID = 0.55;
const GRADIENT_STOP_END = 1;

const COLOR_CORE = "rgba(255, 0, 0, 0.9)";
const COLOR_MID = "rgba(255, 255, 0, 0.7)";
const COLOR_FADE = "rgba(0, 255, 0, 0)";

export const HeatMapOverlay: FC<HeatMapOverlayProps> = ({ points, radius, width, height }) => {
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
    context.globalCompositeOperation = "source-over";
    context.filter = `blur(${OVERLAY_BLUR_PX}px)`;

    points.forEach((point) => {
      const gradient = context.createRadialGradient(
        point.x,
        point.y,
        ZERO,
        point.x,
        point.y,
        radius,
      );
      gradient.addColorStop(GRADIENT_STOP_START, COLOR_CORE);
      gradient.addColorStop(GRADIENT_STOP_MID, COLOR_MID);
      gradient.addColorStop(GRADIENT_STOP_END, COLOR_FADE);
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(point.x, point.y, radius, ZERO, FULL_CIRCLE);
      context.fill();
    });

    context.filter = "none";
    context.globalCompositeOperation = "source-over";
  }, [points, radius, width, height]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: OVERLAY_Z_INDEX,
        pointerEvents: "none",
        opacity: OVERLAY_OPACITY,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
};
