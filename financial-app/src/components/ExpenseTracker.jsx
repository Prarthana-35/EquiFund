import React, { useState, useEffect } from 'react';
import ExpenseChart from './ExpenseChart';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');

  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTenure, setLoanTenure] = useState('');
  const [emi, setEmi] = useState(null);

  const addExpense = () => {
    if (!description || !amount || !category || !date) {
      alert('Please fill all the fields');
      return;
    }
    setExpenses([...expenses, { description, amount, category, date }]);
    setDescription('');
    setAmount('');
    setCategory('');
    setDate('');
  };

  const saveExpense = () => {
    if (editIndex !== null) {
      const updatedExpenses = [...expenses];
      updatedExpenses[editIndex] = { description, amount, category, date };
      setExpenses(updatedExpenses);
      setEditIndex(null);
    } else {
      setExpenses([...expenses, { description, amount, category, date }]);
    }
    setDescription('');
    setAmount('');
    setCategory('');
    setDate('');
  };

  const editExpense = (index) => {
    const expense = expenses[index];
    setDescription(expense.description);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(expense.date);
    setEditIndex(index);
  };

  const totalExpenses = expenses.reduce((total, expense) => total + Number(expense.amount), 0);
  const deleteExpense = (index) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
  };
  const filteredExpenses = filterCategory
    ? expenses.filter((expense) => expense.category === filterCategory)
    : expenses;

  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    setExpenses(savedExpenses);
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const calculateEMI = () => {
    const P = parseFloat(loanAmount); 
    const r = parseFloat(interestRate) / 12 / 100; 
    const n = parseFloat(loanTenure) * 12; 

    if (P && r && n) {
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1); 
      setEmi(emi.toFixed(2)); 
    } else {
      alert('Please fill all fields!');
    }
  };

  return (
    <div>
      <h2>Expense Tracker</h2>
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ lineHeight: '2em', padding: '5px' }}
      >
        <option value="">Select Category</option>
        <option value="Groceries">Groceries</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Bills">Bills</option>
        <option value="Transport">Transport</option>
        <option value="Other">Other</option>
      </select>
      <button onClick={saveExpense}>
        {editIndex !== null ? 'Save Changes' : 'Add Expense'}
      </button>

      <h3>Expense Breakdown</h3>
      <ExpenseChart expenses={expenses} />

      <ul>
        {filteredExpenses.map((expense, index) => (
          <li key={index}>
            {expense.description}: ${expense.amount} ({expense.category}) - {expense.date}
            <button onClick={() => editExpense(index)}>Edit</button>
            <button onClick={() => deleteExpense(index)}>Delete</button>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">EMI Calculator</h3>
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Loan Amount ($)"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Interest Rate (%)"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Loan Tenure (Years)"
            value={loanTenure}
            onChange={(e) => setLoanTenure(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={calculateEMI}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Calculate EMI
          </button>
        </div>
        {emi !== null && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h4 className="text-lg font-semibold">EMI Calculation Result</h4>
            <p className="mt-2">
              Your Monthly EMI: <strong>${emi}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;