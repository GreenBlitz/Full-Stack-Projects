// בס"ד
import { type FC } from "react";
import { Adder } from "./adder/Adder.tsx";
import { Route, Routes } from "react-router-dom";

export const serverURL = "http://localhost:4590/api/v1";

const App: FC = () => {
  return (
    <Routes>
      <Route path={"/add"} element={<Adder />} />
    </Routes>
  );
};

export default App;
