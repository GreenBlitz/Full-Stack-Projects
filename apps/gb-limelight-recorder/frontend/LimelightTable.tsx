//בס"ד
import { useEffect } from "react";
import type React from "react";

interface LimelightTableProps {
  robotOnline: boolean;
  cameras: boolean[];
}

const zero = 0;
const one = 1;

async function doThingy(robotOnline, cameraStatus, index) {
  const camera = index === zero ? "left" : index === one ? "object" : "right";
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

const LimelightTable: React.FC<LimelightTableProps> = ({
  robotOnline,
}) => {

  const cameraStatuses = [false, false, false];

  useEffect(() => {
    cameraStatuses.forEach((cameraStatus, index) => {
      doThingy(robotOnline, cameraStatus, index).catch(() => {
        console.error("Couldnt do the thingy");
      })
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
            <input type="file" disabled={robotOnline} />
          </td>
        </tr>
      </table>
    </>
  );
};

export default LimelightTable;
