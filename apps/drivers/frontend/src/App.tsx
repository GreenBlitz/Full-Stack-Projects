// בס"ד
import { type FC } from "react";
import { Adder } from "./adder/Adder.tsx";
import { Navigate, Route, Routes } from "react-router-dom";
import { Viewer } from "./viewer/Viewer.tsx";

export const SERVER_URL = "http://localhost:4590/api/v1";

const App: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/view" />} />

      <Route path={"/view"} element={<Viewer />} />
      <Route path={"/add"} element={<Adder />} />
    </Routes>
  );
};

export default App;
