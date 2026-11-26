import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

const Navbar = () => {
  return (
    <ul>
      <li><Link to="/bets">Bets</Link></li>
      <li><Link to="/create">Create Bet</Link></li>
      <li><Link to="/admin">Admin</Link></li> {/*To change!!!*/}
    </ul>
  );
};

export default Navbar;
