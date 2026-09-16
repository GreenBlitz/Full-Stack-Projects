// בס"ד
import { useState, type FC } from "react";
import { DuckCard } from "./components/DuckCard";


const App: FC = () => {
  

  return (
    <DuckCard name="Avi" color="red" age={8}/>
  );
};

export default App;