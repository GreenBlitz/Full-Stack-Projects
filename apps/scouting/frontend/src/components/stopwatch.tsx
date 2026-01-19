import React, { useState, useEffect, useRef } from 'react';

function Stopwatch() {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    const intervalIdRef = useRef<number | null>(null);
    const startTimeRef = useRef(0);

    useEffect(() => {
        if (isRunning) {
            intervalIdRef.current = window.setInterval(() => {
                setElapsedTime(Date.now() - startTimeRef.current);
            }, 10);
        }

        return () => {
            if (intervalIdRef.current !== null) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
            }
        };
    }, [isRunning]);

    function start() {
        if (!isRunning) {
            startTimeRef.current = Date.now() - elapsedTime;
            setIsRunning(true);
        }
    }

    function stop() {
        setIsRunning(false);
    }

    function reset() {
        setElapsedTime(0);
        setIsRunning(false);
    }

    function formatTime() {
        const minutes = String(Math.floor((elapsedTime / (1000 * 60)) % 60)).padStart(2, "0");
        const seconds = String(Math.floor((elapsedTime / 1000) % 60)).padStart(2, "0");
        const milliseconds = String(Math.floor((elapsedTime % 1000) / 10)).padStart(2, "0");

        return `${minutes}:${seconds}:${milliseconds}`;
    }

    return (
        <div className="stopwatch">
            <div
                className="display"
                onMouseDown={start}
                onMouseUp={stop}
                onMouseLeave={stop}
                onTouchStart={start}
                onTouchEnd={stop}
            >
                {formatTime()}
            </div>

            <div className="display" onClick={reset}>
                Reset
            </div>
        </div>
    );
}

export default Stopwatch;
