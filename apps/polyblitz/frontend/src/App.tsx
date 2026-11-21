// בס"ד
import { use, useState, type FC } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Home from "./components/Home";
import Products from "./components/Products";
import Services from "./components/Services";

const App: FC = () => {
  const [pages, setPages] = useState(["Home", "Products", "Services"]);
  return (
    <>
      <Router>
        <Navbar pages={pages} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      </Router>
    </>
  );
};
export default App;
