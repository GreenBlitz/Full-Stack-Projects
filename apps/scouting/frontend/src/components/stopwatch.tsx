import React, {useState, useEffect, useRef} from 'react';
import "./Stopwatch.css";

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

        let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
        let seconds = Math.floor(elapsedTime / (1000) % 60);
        let milliseconds = Math.floor((elapsedTime % 1000) / 10);

        const hours1: string = String(hours).padStart(2, "0");
        const minutes1: string = String(minutes).padStart(2, "0");
        const seconds1: string = String(seconds).padStart(2, "0");
        const milliseconds1: string = String(milliseconds).padStart(2, "0");

        return `${minutes1}:${seconds1}:${milliseconds1}`;
    }

    return(
        <div className="stopwatch">
            <div className="display" onClick={start}>{formatTime()}</div>
        </div>
    );
}
export default Stopwatch