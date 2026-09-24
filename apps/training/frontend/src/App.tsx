// בס"ד
import { useState, type FC } from "react";
import { DuckCard, type DuckCardProps } from "./components/DuckCard";
import { Duck } from "./components/Ducks";
const ducks: DuckCardProps[] = [
  { name: "Avi", color: "red", age: 4 },
  { name: "Moshe", color: "blue", age: 12 },
  { name: "Haim", color: "yellow", age: 9 },
  { name: "Karni", color: "green", age: 17 },
];

const App: FC = () => {
  return <Duck ducks={ducks} />;
};

export default App;
