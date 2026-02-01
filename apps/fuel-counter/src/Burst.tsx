import React from "react";

interface Burst {
  videoRef?: React.RefObject<HTMLVideoElement | null>
}

const Burst: React.FC<Burst> = ({ videoRef }) => {
  const [thrown, setThrown] = React.useState(0);
  const [scored, setScored] = React.useState(0);
  const [startTime, setStartTime] = React.useState<number | null>(null);

  return (
    <div style={{backgroundColor:"white", color:"black", padding:"10px", borderRadius:"10px", width: "200px", display: "inline-flex", alignItems:"center", justifyContent:"center", margin:"10px"}}>
      {/* <p style={{display: "block"}}>Start time in secs: {startTime}</p> */}
      <div style={{
          display:"flex", 
          flexDirection:"column", 
          alignItems:"center", 
          justifyContent:"center", 
          margin:"10px"
      }}>
        <p>
          Thrown: {thrown}
        </p>
        <button 
          style={{height:"90px", width:"90px"}}
          onClick={() => {
            if (thrown == 0) {
              setStartTime(videoRef?.current?.currentTime ?? null);
            }
            setThrown(thrown + 1)
          }}
        >
          +1
        </button>
      </div>
      
      <div style={{
        display:"flex", 
        flexDirection:"column", 
        alignItems:"center", 
        justifyContent:"center", 
        margin:"10px"
      }}>
        <p style={{ color: scored <= thrown ? "black" : "red" }}>
          Scored: {scored}
        </p>
        <button 
          style={{height:"90px", width:"90px"}}
          onClick={() => setScored(scored + 1)}
        >
          +1
        </button>
      </div>
    </div>
  )
}

export default Burst;