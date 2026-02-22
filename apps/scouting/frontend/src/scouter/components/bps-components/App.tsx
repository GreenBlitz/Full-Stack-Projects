//בס"ד
import { useRef } from 'react'
import './App.css'
import video from "./10MinuteTimer.mp4"
import Video from './Video'
import Counter from './Counter'

function app() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  return (
    <>
      <div className="videoContainer">
        <Video 
          videoSrc={video} 
          videoRef={videoRef} 
          // timestamps={["00:05", "01:37:00", "00:20"]}
        />
      </div>
      <div>
        <Counter videoRef={videoRef} />
      </div>
    </>
  )
}

export default app
