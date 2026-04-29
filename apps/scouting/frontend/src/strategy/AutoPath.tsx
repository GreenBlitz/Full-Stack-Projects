// בס"ד
// AutoPath.tsx

import { useEffect, useRef, useState, type FC } from "react";

interface Point {
  x: number;
  y: number;
}

interface PathPoint {
  point: Point;
  time: number;
}

interface AutoPathProps {
  path: PathPoint[];
}

const FIELD_WIDTH = 1654; // cm, FRC 2025 field
const FIELD_HEIGHT = 802;

export const AutoPath: FC<AutoPathProps> = ({ path }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  console.log(animFrameRef);
  const sortedPath = [...path].sort((a, b) => a.time - b.time);
  const maxTime = sortedPath.at(-1)?.time ?? 0;

  const getPositionAtTime = (t: number): Point | null => {
    if (sortedPath.length === 0) return null;
    if (t <= sortedPath[0].time) return sortedPath[0].point;
    if (t >= sortedPath.at(-1)!.time) return sortedPath.at(-1)!.point;
    for (let i = 0; i < sortedPath.length - 1; i++) {
      const a = sortedPath[i];
      const b = sortedPath[i + 1];
      if (t >= a.time && t <= b.time) {
        const frac = (t - a.time) / (b.time - a.time);
        return {
          x: a.point.x + (b.point.x - a.point.x) * frac,
          y: a.point.y + (b.point.y - a.point.y) * frac,
        };
      }
    }
    return null;
  };

  const draw = (currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const toCanvas = (p: Point) => ({
      x: (p.x / FIELD_WIDTH) * W,
      y: (p.y / FIELD_HEIGHT) * H,
    });

    ctx.clearRect(0, 0, W, H);

    // Field background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * W;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let i = 0; i <= 5; i++) {
      const y = (i / 5) * H;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Field border
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    if (sortedPath.length === 0) return;

    // Draw full path (faded)
    ctx.beginPath();
    ctx.strokeStyle = "rgba(251,191,36,0.15)";
    ctx.lineWidth = 2;
    const first = toCanvas(sortedPath[0].point);
    ctx.moveTo(first.x, first.y);
    for (const { point } of sortedPath) {
      const c = toCanvas(point);
      ctx.lineTo(c.x, c.y);
    }
    ctx.stroke();

    // Draw traveled path
    const traveledPoints = sortedPath.filter((p) => p.time <= currentTime);
    const currentPos = getPositionAtTime(currentTime);

    if (traveledPoints.length > 0 && currentPos) {
      ctx.beginPath();
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      const start = toCanvas(traveledPoints[0].point);
      ctx.moveTo(start.x, start.y);
      for (const { point } of traveledPoints) {
        const c = toCanvas(point);
        ctx.lineTo(c.x, c.y);
      }
      const cur = toCanvas(currentPos);
      ctx.lineTo(cur.x, cur.y);
      ctx.stroke();

      // Robot dot
      ctx.beginPath();
      ctx.fillStyle = "#f59e0b";
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 12;
      ctx.arc(cur.x, cur.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Start dot
    const startDot = toCanvas(sortedPath[0].point);
    ctx.beginPath();
    ctx.fillStyle = "#10b981";
    ctx.arc(startDot.x, startDot.y, 5, 0, Math.PI * 2);
    ctx.fill();
  };

  useEffect(() => {
    draw(progress * maxTime);
  }, [progress, path]);

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsedMs = timestamp - startTimeRef.current; // keep in ms
    if (elapsedMs >= maxTime) {
      setProgress(1);
      setPlaying(false);
      draw(maxTime);
      return;
    }
    const t = elapsedMs / maxTime;
    setProgress(t);
    draw(elapsedMs); // pass ms to draw
    animFrameRef.current = requestAnimationFrame(animate);
  };

  const handlePlay = () => {
    if (maxTime === 0) return;
    setPlaying(true);
    startTimeRef.current = null;
    animFrameRef.current = requestAnimationFrame(animate);
  };

  const handleReset = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setPlaying(false);
    setProgress(0);
    startTimeRef.current = null;
    draw(0);
  };

  useEffect(
    () => () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    },
    [],
  );

  return (
    <div className="bg-slate-800/40 border border-white/5 p-5 rounded-2xl flex flex-col gap-3">
      <label className="text-[10px] font-bold uppercase text-slate-500">
        Auto Path
      </label>
      <canvas
        ref={canvasRef}
        width={600}
        height={290}
        className="w-full rounded-xl border border-white/5"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={playing ? undefined : handlePlay}
          disabled={playing || maxTime === 0}
          className="px-4 py-1.5 bg-amber-500 text-slate-950 text-[10px] font-black uppercase rounded-lg disabled:opacity-40 hover:bg-amber-400 transition-all active:scale-95"
        >
          {playing ? "Playing..." : "Play"}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-1.5 bg-slate-700 text-slate-200 text-[10px] font-black uppercase rounded-lg hover:bg-slate-600 transition-all active:scale-95"
        >
          Reset
        </button>
        <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          {((progress * maxTime) / 1000).toFixed(1)}s
        </span>
      </div>
    </div>
  );
};
