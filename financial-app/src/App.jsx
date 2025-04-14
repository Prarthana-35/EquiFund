import {React,useEffect} from 'react';
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
import CreditEvaluation from './components/CreditEvaluation';
import Game from './pages/Game';
import { io } from "socket.io-client";
import './index.css';

function App() {
  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    return () => socket.disconnect(); // Cleanup on unmount
  }, []);
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
        <Route path="/credit" element={<CreditEvaluation />} />
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;
