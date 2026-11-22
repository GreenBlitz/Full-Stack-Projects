// בס"ד
import { use, useState, type FC } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";

const App: FC = () => {
  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/main" element={<div>Main Bet Page</div>}/> {/*Replace div with page*/}
          <Route path="/create" element={<div>Create Bet</div>}/> {/*Replace div with page*/}
          <Route path="/admin" element={<div>Admin Page</div>}/> {/*Replace div with page, make admin only accesible for admins*/}
        </Routes>
      </Router>
    </>
  );
};
export default App;
