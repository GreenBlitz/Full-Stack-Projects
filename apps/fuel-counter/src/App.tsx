import { useRef } from 'react'
import './App.css'
import Burst from './Burst'
import video from "./nothing_interesting_in_this_one.mp4"
import Video from './Video'

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  return (
    <>
      <div className="videoContainer">
        <Video 
          videoSrc={video} 
          videoRef={videoRef} 
          timestamps={["00:05", "01:37:00", "00:20"]} 
        />
      </div>
      <div>
        <Burst />
      </div>
    </>
  )
}

export default App
