import React, {useState, useEffect, useRef} from 'react';

function Stopwatch(){

    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalIdRef = useRef(0);
    const startTimeRef = useRef(0);

    useEffect(() => {

        if(isRunning){
            intervalIdRef.current = setInterval(() => {
                setElapsedTime(Date.now() - startTimeRef.current);
            }, 10);
        }

        return () => {
            clearInterval(intervalIdRef.current);
        }
    }, [isRunning]);

    function start(){
        if(!isRunning){
            setIsRunning(true);
            startTimeRef.current = Date.now() - elapsedTime;
        }
        else{
            setIsRunning(false);
        }
    }

    function reset(){
        setElapsedTime(0);
        setIsRunning(false);
    }

    function formatTime(){

        const hours: string = String(Math.floor(elapsedTime / (1000 * 60 * 60))).padStart(2, "0");
        const minutes: string = String(Math.floor(elapsedTime / (1000 * 60) % 60)).padStart(2, "0");
        const seconds: string = String(Math.floor(elapsedTime / (1000) % 60)).padStart(2, "0");
        const milliseconds: string = String(Math.floor((elapsedTime % 1000) / 10)).padStart(2, "0");

        return `${minutes}:${seconds}:${milliseconds}`;
    }

    return(
        <div className="stopwatch">
            <div className="display" onClick={start}>{formatTime()}</div>
            <div className="display" onClick={reset}>Reset</div>

        </div>
    );
}
export default Stopwatch