//בס"ד
import { useState } from "react";
import "./Video.css";
import type React from "react";

interface VideoProps {
  videoSrc: string;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  timestamps?: string[];
}

interface Timestamp {
  time: string;
  timeInSecs: number;
}

const Video: React.FC<VideoProps> = ({
  videoSrc,
  timestamps = [],
  videoRef,
}) => {
  const zero = 0;
  const quarter = 0.25;
  const half = 0.5;
  const one = 1;
  const two = 2;
  const three = 3;
  const five = 5;
  const onehundred = 100;
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(one);
  const [progress, setProgress] = useState(zero);

  const updateProgress = () => {
    if (videoRef?.current) {
      const percent =
        (videoRef.current.currentTime / videoRef.current.duration) * onehundred;
      setProgress(percent);
    }
  };

  const togglePlay = () => {
    if (videoRef?.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        void videoRef.current.play();
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
    const sixty = 60;
    const n3600 = 3600;
    const parts = time.split(":").map(Number);

    if (parts.length === two) {
      const [minutes, seconds] = parts;
      return minutes * sixty + seconds;
    }

    if (parts.length === three) {
      const [hours, minutes, seconds] = parts;
      return hours * n3600 + minutes * sixty + seconds;
    }

    return zero;
  };

  const prevTimestamp = (): string | null => {
    if (!videoRef?.current) return null;

    const { currentTime } = videoRef.current;
    let lastTimestamp: string | null = null;

    for (const time of timestamps) {
      if (convertToSecs(time) <= currentTime - one) {
        lastTimestamp = time;
      } else {
        break;
      }
    }

    return lastTimestamp;
  };

  timestamps.sort((a, b) => convertToSecs(a) - convertToSecs(b));

  const doubleTimestamps = [] as Timestamp[];
  timestamps.map((time) => {
    doubleTimestamps.push({ time: time, timeInSecs: convertToSecs(time) });
  });

  return (
    <>
      {/* Timestamp Buttons */}
      {timestamps.length > zero && (
        <div className="timestampContainer">
          <button
            className="timestampButton leftButton"
            onClick={() => {
              jumpToTime(convertToSecs(prevTimestamp() ?? "00:00"));
            }}
          >
            {"<<<"}
          </button>
          {doubleTimestamps.map((bothTimes, index) => (
            <button
              key={index}
              className="timestampButton centerButton"
              onClick={() => {
                jumpToTime(doubleTimestamps[index].timeInSecs);
              }}
            >
              {bothTimes.time}
            </button>
          ))}
          <button
            className="timestampButton rightButton"
            onClick={() => {
              const prev = prevTimestamp();
              if (prev) {
                jumpToTime(convertToSecs(prev));
              } else if (videoRef?.current) {
                jumpToTime(videoRef.current.duration);
              } else {
                jumpToTime(zero);
              }
            }}
          >
            {">>>"}
          </button>
        </div>
      )}

      {/* Video */}
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

      <div className="progressBar" style={{ width: `${progress}%` }} />

      {/* Settings Under Video */}
      <div className="settingsContainer">
        <div className="speedSettings">
          <button onClick={togglePlay}>{isPlaying ? "⏸️" : "▶️"}</button>

          <label className="buttonLabel">
            <input
              type="radio"
              name="speed"
              value="1"
              checked={speed === one}
              onChange={() => {
                handleSpeedChange(one);
              }}
            />
            <span className="settingsButton leftButton">1×</span>
          </label>

          <label className="buttonLabel">
            <input
              type="radio"
              name="speed"
              value="0.5"
              checked={speed === half}
              onChange={() => {
                handleSpeedChange(half);
              }}
            />
            <span className="settingsButton centerButton">0.5×</span>
          </label>

          <label className="buttonLabel">
            <input
              type="radio"
              name="speed"
              value="0.25"
              checked={speed === quarter}
              onChange={() => {
                handleSpeedChange(quarter);
              }}
            />
            <span className="settingsButton rightButton">0.25×</span>
          </label>
        </div>

        <div className="timeJumpSettings">
          <label className="buttonLabel">
            <input
              type="button"
              name="jumpBack"
              value="<< 5"
              onClick={() => {
                jumpTime(-five);
              }}
            />
            <span className="settingsButton leftButton">{"<< 5"}</span>
          </label>

          <label className="buttonLabel">
            <input
              type="button"
              name="jumpBack"
              value="5 >>"
              onClick={() => {
                jumpTime(five);
              }}
            />
            <span className="settingsButton rightButton">{"5 >>"}</span>
          </label>
        </div>
      </div>
    </>
  );
};

export default Video;
