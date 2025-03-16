import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Budgeting from './pages/Budgeting';
import Investments from './pages/Investments';
import Education from './pages/Education';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ExpenseChart from './components/ExpenseChart';
import Game from './pages/Game';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/budgeting" element={<Budgeting />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/education" element={<Education />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chart" element={<ExpenseChart/>} />
        <Route path="/game" element={<Game />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
