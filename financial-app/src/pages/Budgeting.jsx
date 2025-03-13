/* eslint-disable no-unused-vars */
import React from 'react';
import BudgetingTools from '../components/BudgetingTools';
import ExpenseTracker from '../components/ExpenseTracker';
const Budgeting = () => {
  return (
    <div>
      <h1>Budgeting Page</h1>
      <ExpenseTracker />
      <BudgetingTools />
    </div>
  );
};

export default Budgeting;
