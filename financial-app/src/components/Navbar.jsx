import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; 
import logo from "../assets/empowher_logo.jpg";
import { FaHome, FaChartLine, FaMoneyBillWave, FaUsers, FaSignInAlt , FaBookOpen, FaGamepad } from 'react-icons/fa';
const Navbar = () => {
  return (
  <>
     <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="EmpowHER Logo" className="logo-img" />
          </Link>

          {/* Navigation Links */}
          <div className="nav-links">
            <Link to="/" className="nav-link"><FaHome />Home</Link>
            <Link to="/budgeting" className="nav-link"><FaMoneyBillWave />Budgeting</Link>
            <Link to="/investments" className="nav-link"><FaChartLine />Investments</Link>
            <Link to="/education" className="nav-link"><FaBookOpen />Education</Link>
            <Link to="/game" className="nav-link game-link"><FaGamepad />Quizzes & Games</Link>
            <Link to="/login" className="nav-link"><FaSignInAlt />Login</Link>
            <Link to="/register" className="nav-link register-link"><FaUsers />Register</Link>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
