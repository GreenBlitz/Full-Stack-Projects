import { useRef } from 'react'
import './App.css'
// import Burst from './Burst'
import video from "./nothing_interesting_in_this_one.mp4"
import Video from './Video'
import Counter from './Counter'
import type { BurstData } from './Counter'
import Burst from './Burst'

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
        <Burst videoRef={videoRef} data={{index: 0, thrown: 0, scored: 0, thrownArray: [], scoredArray: []}} />
        {/* <Counter videoRef={videoRef} /> */}
      </div>
    </>
  )
}

export default App
