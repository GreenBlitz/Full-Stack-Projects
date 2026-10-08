import type { FC } from "react";
import { SayErrorComponet } from "./TryAndCatchComponets.tsx/SayErrorComponet";

const TryAndCatchPage: FC = () => {
  return (
    <main>
      <h1>Try and catch</h1>
      <SayErrorComponet />
    </main>
  );
};

export default TryAndCatchPage;
