import React from 'react';
import ExpenseTracker from '../components/ExpenseTracker';
import BudgetingTools from '../components/BudgetingTools';
import InvestmentPortfolio from '../components/InvestmentPortfolio';
import woman from '../assets/woman.jpg'; 
import '../App.css';

const Home = () => {
  return (
    <div className='text-center p-2'>
      <div className="image-container">
        <img src={woman} alt="Expense Tracker" className="w-full max-w-[2500px] max-h-[800px] rounded-lg my-5 mx-auto" />
        {/* <div className="text-overlay">Empow<br/><b className='text-xl font-bold'>HER</b></div> */}
        <div className="text-overlay text-6xl font-extrabold leading-tight">
      Empow<br />
      <span className="text-7xl font-black text-blue-600">HER</span>
    </div>
      </div>
      <p>Track your expenses, manage your budget, and achieve your financial goals!</p>
    </div>
  );
};
export default Home;