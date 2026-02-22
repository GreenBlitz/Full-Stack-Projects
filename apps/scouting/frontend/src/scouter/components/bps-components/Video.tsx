//בס"ד
import { useState } from "react";
import "./Video.css";
import type React from "react";
import { isEmpty, lastElement } from "@repo/array-functions";

interface VideoProps {
  videoSrc: string;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  timestamps?: string[];
}

interface Timestamp {
  time: string;
  timeInSecs: number;
}

  export const convertToSecs = (time: string): number => {
    const oneMin = 60;
    const parts = time.split(":").map(Number);

    if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return minutes * oneMin + seconds;
    }

    return 0;
  };

const Video: React.FC<VideoProps> = ({
  videoSrc,
  timestamps = [],
  videoRef,
}) => {
  const VIDEO_START = 0;
  const quarter = 0.25;
  const half = 0.5;
  const initialSpeed = 1;
  const minsAndSecs = 2;
  const fiveSeconds = 5;
  const fullVideo = 100;
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(initialSpeed);
  const [progress, setProgress] = useState(VIDEO_START);

  const updateProgress = () => {
    if (videoRef?.current) {
      const percent =
        (videoRef.current.currentTime / videoRef.current.duration) * fullVideo;
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



  const prevTimestamp = (): string | null => {
    if (!videoRef?.current) return null;

    const { currentTime } = videoRef.current;
    let lastTimestamp: string | null = null;

    const tolerance = 1;
    const filteredTimestamps = timestamps.filter((time) => convertToSecs(time) <= currentTime - tolerance);

    return lastElement(filteredTimestamps);
  };

  return (
    <>
      {/* Timestamp Buttons */}
      {!isEmpty(timestamps) && (
        <div className="timestampContainer">
          <button
            className="settingsButton leftButton"
            onClick={() => {
              jumpToTime(convertToSecs(prevTimestamp() ?? "00:00"));
            }}
          >
            {"<<<"}
          </button>
          {timestamps.map((timestamp, index) => (
            <button
              key={index}
              className="settingsButton centerButton"
              onClick={() => {
                jumpToTime(convertToSecs(timestamp));
              }}
            >
              {timestamp}
            </button>
          ))}
          <button
            className="settingsButton rightButton"
            onClick={() => {
              const prev = prevTimestamp();
              if (prev) {
                jumpToTime(convertToSecs(prev));
              } else if (videoRef?.current) {
                jumpToTime(videoRef.current.duration);
              } else {
                jumpToTime(VIDEO_START);
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
              checked={speed === initialSpeed}
              onChange={() => {
                handleSpeedChange(initialSpeed);
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
                jumpTime(-fiveSeconds);
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
                jumpTime(fiveSeconds);
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
