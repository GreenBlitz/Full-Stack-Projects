//בס"ד
import { useEffect, useState, useRef } from "react";
import type React from "react";
import type { HTMLAttributes } from "react";

interface LimelightTableProps {
  robotOnline: boolean;
  cameras: boolean[];
}

type cameraObj = {
  name: string
  status: boolean
  camURL: string
}

declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: boolean;
  }
}

async function doThingy(
  robotOnline: boolean,
  cameras: cameraObj[],
  index: number
) {
  const camera = cameras[index];
  if (robotOnline && camera.status) {
    await fetch(`http://localhost:5000/record/start/${camera}`, {
      method: "POST",
    });
  } else if (!robotOnline) {
    await fetch(`http://localhost:5000/record/stop/${camera}`, {
      method: "POST",
    });
  }
  camera.status = !camera.status;
}

const LimelightTable: React.FC<LimelightTableProps> = ({ robotOnline }) => {
  const leftCamObj: cameraObj = {
    name: "left",
    status: false,
    camURL: "http://limelight-left.local:5800/",
  };
  const objectCamObj: cameraObj = {
    name: "object",
    status: false,
    camURL: "http://limelight-object.local:5800/",
  };
  const rightCamObj: cameraObj = {
    name: "right",
    status: false,
    camURL: "http://limelight.local:5800/",
  };
  const cameras = [leftCamObj, objectCamObj, rightCamObj];
  const [fileLocation, setFileLocation] = useState("");
  const locationPickerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    cameras.forEach((camera, index) => {
      doThingy(robotOnline, cameras, index).catch(() => {
        console.error("Couldnt do the thingy");
      });
    });
  }, [robotOnline]);

  // For the substring in cameras.map to capitalize first letter
  const zero = 0;
  const one = 1;
  
  return (
    <>
      <table border={1}>
        <tr>
          {cameras.map((camera, index) => (
            <td key={index}>{camera.name.substring(zero, one).toUpperCase()}</td>
          ))}
        </tr>
        <tr>
          {cameras.map((camera, index) => (
            <td key={index}>{camera.camURL}</td>
          ))}
        </tr>
        <tr>
          {cameras.map((camera) => (
            <img key={camera.name} src={camera.camURL} />
          ))}
        </tr>
        <tr>
          <td colSpan={3}>
            <input ref={locationPickerRef} type="file" id="locationPicker" disabled={robotOnline} webkitdirectory />
            <br />
            <button
              disabled={robotOnline}
              onClick={() => {
                const files = locationPickerRef.current?.files;
                const file = files?.[zero];
                setFileLocation(file?.name ?? "");
              }}
            >Save Location</button>
            <br />
            <p>Location: {fileLocation}</p>
          </td>
        </tr>
      </table>
    </>
  );
};

export default LimelightTable;
