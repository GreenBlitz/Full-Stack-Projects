//בס"ד
import { useRef } from 'react'
import './Video.css'
import video from "./timerVideo.mp4"
import Video from './Video'
import Counter from './Counter'
import { convertToSecs } from './Video'

function app() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timestamps = ["00:05", "37:00", "00:20"];
  
  return (
    <div className="max-w-[1280px] mx-auto p-8 text-center">
      <div className="videoContainer">
        <Video 
          videoSrc={video} 
          videoRef={videoRef} 
          timestamps={timestamps.sort((a, b) => convertToSecs(a) - convertToSecs(b))}
        />
      </div>
      <div>
        <Counter videoRef={videoRef} />
      </div>
    </div>
  )
}

export default app
