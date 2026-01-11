// בס"ד
import ping from "ping";

async function pingRobot(robotIp: string) {
  const result = await ping.promise.probe(robotIp, { timeout: 10 });
  return result;
}

export async function pingCameras(): Promise<boolean> {
  const robotIp = "10.45.90.2";
  const isUp = await pingRobot(robotIp).then((res) => res);

  if (isUp.alive) {
    console.log(`Robot at ${robotIp} is online.`);
    return true;
  }
  console.log(`Robot at ${robotIp} is offline.`);
  return false;
}

// export default { pingCameras };

