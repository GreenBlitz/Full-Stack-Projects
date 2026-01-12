// בס"ד
import React, { useState, useRef, useCallback, type FC } from "react";
import { useVibrate } from "./VibrateHook";

export const CircularDragCounter: FC = () => {
  const [count, setCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const circleRef = useRef<HTMLDivElement>(null);
  const lastAngleRef = useRef<number | null>(null);
  const accumulatedRotationRef = useRef(0);

  const getAngle = useCallback((clientX: number, clientY: number) => {
    if (!circleRef.current) return 0;

    const rect = circleRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    return Math.atan2(dy, dx);
  }, []);
  const vibrationTime = 1;

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      setIsDragging(true);
      lastAngleRef.current = getAngle(clientX, clientY);
      accumulatedRotationRef.current = 0;
    },
    [getAngle]
  );
  const { vibrate, stop, isSupported } = useVibrate();

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || lastAngleRef.current === null) return;

      const currentAngle = getAngle(clientX, clientY);
      let deltaAngle = currentAngle - lastAngleRef.current;

      // Handle wraparound at -π/π boundary
      if (deltaAngle > Math.PI) {
        deltaAngle -= 2 * Math.PI;
      } else if (deltaAngle < -Math.PI) {
        deltaAngle += 2 * Math.PI;
      }

      accumulatedRotationRef.current += deltaAngle;

      // Check if we've completed a tenth of a rotation (π/5 radians = 36 degrees)
      const tenthRotation = (2 * Math.PI) / 10;

      if (accumulatedRotationRef.current >= tenthRotation) {
        const increments = Math.floor(
          accumulatedRotationRef.current / tenthRotation
        );

        setCount((c) => c + increments);
        vibrate(vibrationTime);

        accumulatedRotationRef.current -= increments * tenthRotation;
      } else if (accumulatedRotationRef.current <= -tenthRotation) {
        const decrements = Math.floor(
          Math.abs(accumulatedRotationRef.current) / tenthRotation
        );
        setCount((c) => c - decrements);
        vibrate(vibrationTime);

        accumulatedRotationRef.current += decrements * tenthRotation;
      }

      lastAngleRef.current = currentAngle;
    },
    [isDragging, getAngle]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    lastAngleRef.current = null;
    accumulatedRotationRef.current = 0;
  }, []);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    },
    [handleMove]
  );

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    },
    [handleMove]
  );

  const handleTouchEnd = useCallback(() => {
    handleEnd();
    stop();
  }, [handleEnd]);

  // Set up global event listeners
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  // Generate notch positions (10 notches for 10 segments)
  const notches = Array.from({ length: 10 }, (_, i) => {
    const angle = i * 36 - 90; // Start from top (0 degrees is right, -90 is top)
    return angle;
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div
        className={`text-center cursor-grab ${
          isDragging ? "cursor-grabbing scale-105" : ""
        }`}
        ref={circleRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseDownCapture={() => {
          setCount((prev) => prev + 1);
          vibrate(vibrationTime);
        }}
      >
        <div className="relative w-64 h-64">
          {/* Notches */}
          {notches.map((angle, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                width: "256px",
                height: "2px",
                zIndex: 1,
              }}
            >
              <div className="absolute right-0 w-16 h-1 bg-white rounded-full"></div>
            </div>
          ))}

          {/* Donut circle */}
          <div
            className={`absolute inset-0 rounded-full transition-transform select-none touch-none`}
            style={{
              background:
                "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #3b82f6)",
              WebkitMaskImage:
                "radial-gradient(circle, transparent 0%, transparent 35%, black 35%, black 100%)",
              maskImage:
                "radial-gradient(circle, transparent 0%, transparent 35%, black 35%, black 100%)",
            }}
          ></div>

          {/* Counter in the center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-white text-6xl font-bold">{count}</div>
          </div>
        </div>
        <p className="mt-8 text-gray-300 text-sm">
          Drag in a circle to change the counter
        </p>
        <button
          type="button"
          value="Reset"
          className="mt-8"
          onClick={() => {
            setCount(0);
          }}
        />
      </div>
    </div>
  );
};
