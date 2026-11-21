import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Home from "../components/Home";
import Products from "../components/Products";
import Services from "../components/Services";

export interface NavbarProps {
  pages: string[];
}

const Navbar = ({ pages }: NavbarProps) => {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      {pages.map((page) => (
        <li>
          <Link to={`/${page.toLowerCase()}`}>{page}</Link>
        </li>
      ))}
    </ul>
  );
};

export default Navbar;
