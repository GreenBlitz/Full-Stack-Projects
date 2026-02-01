import { useState } from "react"
import "./Video.css"

interface Video {
  videoSrc: string
  videoRef?: React.RefObject<HTMLVideoElement | null>
  timestamps: string[]
}

interface Timestamp {
  time: string
  timeInSecs: number
}

const Video: React.FC<Video> = ({ videoSrc, timestamps, videoRef }) => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [progress, setProgress] = useState(0);
  

  const updateProgress = () => {
    if (videoRef?.current) {
      const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percent);
    }
  };

  const togglePlay = () => {
    if (videoRef?.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef?.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const jumpTime = (seconds: number) => {
    if (videoRef?.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const jumpToTime = (time: number) => {
    if (videoRef?.current) {
      videoRef.current.currentTime = time;
    }
  };

  const convertToSecs = (time: string): number => {
    const parts = time.split(':').map(Number);

    if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return minutes * 60 + seconds;
    }

    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return hours * 3600 + minutes * 60 + seconds;
    }

    return 0;
  }

  const prevTimestamp = (): string | null => {
  if (!videoRef?.current) return null;

  const currentTime = videoRef.current.currentTime;
  let lastTimestamp: string | null = null;

  for (let i = 0; i < timestamps.length; i++) {
    if (convertToSecs(timestamps[i]) <= currentTime - 1) { // Adding 1 second tolerance
      lastTimestamp = timestamps[i];
    } else {
      break;
    }
  }

  return lastTimestamp;
};


  timestamps = timestamps.sort((a, b) => convertToSecs(a) - convertToSecs(b));
  
  const doubleTimestamps = [] as Timestamp[];
  timestamps.map((time) => {
    doubleTimestamps.push({time: time, timeInSecs: convertToSecs(time)});
  });

  return (
    <>
      <div className="timestampContainer">
        <button className="timestampButton leftButton"
          onClick={() => jumpToTime(convertToSecs(prevTimestamp() || "00:00"))}
        >
          {"<<<"}
        </button>
        {doubleTimestamps.map((bothTimes, index) => (
          <button 
            key={index} 
            className="timestampButton centerButton"
            onClick={() => jumpToTime(doubleTimestamps[index].timeInSecs)}
          >
            {bothTimes.time}
          </button>
        ))}
        <button className="timestampButton rightButton"
          onClick={() => {
            const prev = prevTimestamp();
            if (prev) {
              jumpToTime(convertToSecs(prev));
            } else if (videoRef?.current) {
              jumpToTime(videoRef.current.duration);
            } else {
              jumpToTime(0);
            }
          }}
        >
          {">>>"}
        </button>
      </div>

      <video
        className="video"
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onTimeUpdate={updateProgress}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <div className="progressBar" style={{width: `${progress}%`}} />

      <div className="settingsContainer">
        <div style={{display:"inline-block", float:"left", textAlign:"left"}}>
          <button onClick={togglePlay}>
            {isPlaying ? "⏸️" : "▶️"}
          </button>
          
          <label className="buttonWrapper">
            <input
              type="radio"
              name="speed"
              value="1"
              checked={speed === 1}
              onChange={() => handleSpeedChange(1)}
            />
            <span className="settingsButton leftButton">1×</span>
          </label>

          <label className="buttonWrapper">
            <input
              type="radio"
              name="speed"
              value="0.5"
              checked={speed === 0.5}
              onChange={() => handleSpeedChange(0.5)}
            />
            <span className="settingsButton centerButton">0.5×</span>
          </label>
          
          <label className="buttonWrapper">
            <input
              type="radio"
              name="speed"
              value="0.25"
              checked={speed === 0.25}
              onChange={() => handleSpeedChange(0.25)}
            />
            <span className="settingsButton rightButton">0.25×</span>
          </label>
        </div>

        <div style={{display:"inline-block", float:"right", textAlign:"left"}}>
          <label className="buttonWrapper">
            <input
              type="button"
              name="jumpBack"
              value="<< 5"
              onClick={() => jumpTime(-5)}
            />
            <span className="settingsButton leftButton">{"<< 5"}</span>
          </label>

          <label className="buttonWrapper">
            <input
              type="button"
              name="jumpBack"
              value="5 >>"
              onClick={() => jumpTime(5)}
            />
            <span className="settingsButton rightButton">{"5 >>"}</span>
          </label>
        </div>
      </div>
    </> 
  )
}

export default Video