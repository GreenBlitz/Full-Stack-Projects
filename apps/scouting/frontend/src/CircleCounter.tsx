// בס"ד
import React, { useState, useRef, useCallback, type FC } from "react";

const startingCountValue = 0;

export const CircularDragCounter: FC = () => {
  const [count, setCount] = useState(startingCountValue);
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

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      setIsDragging(true);
      lastAngleRef.current = getAngle(clientX, clientY);
      accumulatedRotationRef.current = 0;
    },
    [getAngle]
  );

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
        accumulatedRotationRef.current -= increments * tenthRotation;
      } else if (accumulatedRotationRef.current <= -tenthRotation) {
        const decrements = Math.floor(
          Math.abs(accumulatedRotationRef.current) / tenthRotation
        );
        setCount((c) => c - decrements);
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center">
        <div
          ref={circleRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`w-64 h-64 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl flex items-center justify-center cursor-grab ${
            isDragging ? "cursor-grabbing scale-105" : ""
          } transition-transform select-none touch-none`}
        >
          <div className="text-white text-6xl font-bold">{count}</div>
        </div>
        <p className="mt-8 text-gray-300 text-sm">
          Drag in a circle to change the counter
        </p>
      </div>
    </div>
  );
};
