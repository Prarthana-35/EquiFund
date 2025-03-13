/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Make sure to import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/budgeting" className="nav-link">Budgeting</Link>
        <Link to="/investments" className="nav-link">Investments</Link>
        <Link to="/education" className="nav-link">Education</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link register-link">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
