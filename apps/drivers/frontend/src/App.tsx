// בס"ד
import { type FC } from "react";
import { Adder } from "./adder/Adder.tsx";

export const serverURL = "http://localhost:4590/api/v1";

const App: FC = () => {
  return (
    <>
      <Adder />
    </>
  );
};

export default App;
