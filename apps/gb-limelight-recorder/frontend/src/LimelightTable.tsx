//בס"ד
import { useEffect, useState, useRef } from "react";
import type React from "react";
import type { HTMLAttributes } from "react";

interface LimelightTableProps {
  robotOnline: boolean;
  cameras: boolean[];
}

declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: boolean;
  }
}

const leftCamIndex = 0;
const rightCamIndex = 1;

async function doThingy(
  robotOnline: boolean,
  cameraStatus: boolean,
  index: number
) {
  const camera = index === leftCamIndex ? "left" : index === rightCamIndex ? "object" : "right";
  if (robotOnline && cameraStatus) {
    await fetch(`http://localhost:5000/record/start/${camera}`, {
      method: "POST",
    });
  } else if (!robotOnline) {
    await fetch(`http://localhost:5000/record/stop/${camera}`, {
      method: "POST",
    });
  }
}

const LimelightTable: React.FC<LimelightTableProps> = ({ robotOnline }) => {
  const cameraStatuses = [false, false, false];
  const [fileLocation, setFileLocation] = useState("");
  const locationPickerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    cameraStatuses.forEach((cameraStatus, index) => {
      doThingy(robotOnline, cameraStatus, index).catch(() => {
        console.error("Couldnt do the thingy");
      });
    });
  }, [robotOnline]);

  return (
    <>
      <table border={1}>
        <tr>
          <th>Left</th>
          <th>Object</th>
          <th>Right</th>
        </tr>
        <tr>
          <td>limelight-left.local:5800</td>
          <td>limelight-object.local:5800</td>
          <td>limelight.local:5800</td>
        </tr>
        <tr>
          <td>
            <img src="http://limelight-left.local:5800/" />
          </td>
          <td>
            <img src="http://limelight-object.local:5800/" />
          </td>
          <td>
            <img src="http://limelight.local:5800/" />
          </td>
        </tr>
        <tr>
          <td colSpan={3}>
            <input ref={locationPickerRef} type="file" id="locationPicker" disabled={robotOnline} webkitdirectory />
            <br />
            <button
              disabled={robotOnline}
              onClick={() => {
                const files = locationPickerRef.current?.files;
                const file = files?.[leftCamIndex];
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
