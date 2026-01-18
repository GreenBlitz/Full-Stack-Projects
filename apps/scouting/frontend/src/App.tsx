// בס"ד
import { useState, type FC } from "react";
import StartGameButton from "./components/StartGameButton";

const basequal = 0;
const VALID_MIN = 2;
const VALID_MAX = 127;

interface AppProps {
  qual: string;
}

const StartTimer: FC<AppProps> = ({ qual }) => {
  return (
    <div className="mx-auto">
      <h1>Match start Timer:</h1>
      <div className="card mt-10">
        <h2 className="text-xl font-bold mb-4">start timer</h2>
        <div className="flex flex-col gap-4">
          <StartGameButton qual={qual} />
        </div>
      </div>
    </div>
  );
};

const App: FC = () => {
  const qual:number= (basequal);
  const isValid = qual >= VALID_MIN && qual <= VALID_MAX;
  return (
    <StartTimer 
      qual={isValid ? qual.toString() : String(basequal)} 
    />
  );
};
export default App;
