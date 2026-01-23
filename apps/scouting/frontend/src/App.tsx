// בס"ד
import { useState, type FC } from "react";
import { Climb } from "./components/Climb";

const counterStartingValue = 0;
const countIncrement = 1;
const maxCountingValue = 5;
const App: FC = () => {
  const [count, setCount] = useState<string | number>(counterStartingValue);

  return <Climb />;
};

export default App;
