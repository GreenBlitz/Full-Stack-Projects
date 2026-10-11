import type { FC } from "react";
import { SchoolButton } from "./SchoolComponents/SchoolButton";
import { StudentButton } from "./SchoolComponents/StudentButton";
import axios from "axios";

const App: FC = () => {
  return (
    <>
      <h1> School Page </h1>
      <SchoolButton />
      <StudentButton />
    </>
  );
};

export default App;
