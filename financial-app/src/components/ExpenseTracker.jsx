import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseChart from "./ExpenseChart";
import { Grid, Button, TextField, Select, MenuItem, Container, Paper, Typography } from "@mui/material";
import { Card, CardContent, IconButton, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [emi, setEmi] = useState(null);

  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const [exchangeRates, setExchangeRates] = useState({});
  const [convertedExpenses, setConvertedExpenses] = useState([]);

  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    setExpenses(savedExpenses);
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const apiKey = import.meta.env.VITE_API_KEY_CURRENCY;
        const response = await axios.get(
          `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`
        );
        setExchangeRates(response.data.conversion_rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRates();
  }, [baseCurrency]);

  const addExpense = () => {
    if (!description || !amount || !category || !date) {
      alert("Please fill all the fields");
      return;
    }
    setExpenses([...expenses, { description, amount, category, date }]);
    setDescription("");
    setAmount("");
    setCategory("");
    setDate("");
  };

  const editExpense = (index) => {
    const expense = expenses[index];
    setDescription(expense.description);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(expense.date);
    setEditIndex(index);
  };

  const saveExpense = () => {
    if (editIndex !== null) {
      const updatedExpenses = [...expenses];
      updatedExpenses[editIndex] = { description, amount, category, date };
      setExpenses(updatedExpenses);
      setEditIndex(null);
    } else {
      addExpense();
    }
  };

  const deleteExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 12 / 100;
    const n = parseFloat(loanTenure) * 12;

    if (P && r && n) {
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setEmi(emi.toFixed(2));
    } else {
      alert("Please fill all fields!");
    }
  };

  const convertExpenses = () => {
    if (!exchangeRates[targetCurrency]) {
      alert("Exchange rate not available for the selected currency.");
      return;
    }

    const converted = expenses.map((expense) => ({
      ...expense,
      convertedAmount: (expense.amount * exchangeRates[targetCurrency]).toFixed(2),
    }));

    setConvertedExpenses(converted);
  };

  return (
    <Container>
      <Paper
        style={{
          padding: "20px",
          marginTop: "20px",
          backgroundColor: "#2D2D2D",
          color: "#ffffff",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Expense Tracker
        </Typography>

        {/* Input Fields in Grid */}
        <Grid container spacing={2} columns={16}>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              InputLabelProps={{ style: { color: "#ffffff" } }}
              InputProps={{ style: { color: "#ffffff", borderColor: "#ffffff" } }}
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Amount"
              variant="outlined"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputLabelProps={{ style: { color: "#ffffff" } }}
              InputProps={{ style: { color: "#ffffff", borderColor: "#ffffff" } }}
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              variant="outlined"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true, style: { color: "#ffffff" } }}
              InputProps={{ style: { color: "#ffffff", borderColor: "#ffffff" } }}
            />
          </Grid>
          <Grid item xs={8}>
            <Select
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              variant="outlined"
              displayEmpty
              style={{ color: "#ffffff", borderColor: "#ffffff" }}
            >
              <MenuItem value="">Select Category</MenuItem>
              <MenuItem value="Groceries">Groceries</MenuItem>
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Entertainment">Entertainment</MenuItem>
              <MenuItem value="Bills">Bills</MenuItem>
              <MenuItem value="Transport">Transport</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </Grid>
        </Grid>

        {/* Add Expense Button Centered */}
        <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
          <Button variant="contained" color="success" onClick={saveExpense}>
            {editIndex !== null ? "Save Changes" : "Add Expense"}
          </Button>
        </Grid>

        <Typography variant="h5" style={{ marginTop: "20px" }}>
          Expense Breakdown
        </Typography>
        <ExpenseChart expenses={expenses} />

        <ul style={{ listStyleType: "none", padding: 0 }}>
          {expenses.map((expense, index) => (
            <Card key={index} sx={{ marginBottom: 2, backgroundColor: "#2c2c2c", color: "#ffffff" }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1">
                    {expense.description}: ${expense.amount} ({expense.category}) - {expense.date}
                    {convertedExpenses[index] && (
                      <span style={{ marginLeft: "10px" }}>
                        ({targetCurrency} {convertedExpenses[index].convertedAmount})
                      </span>
                    )}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton color="primary" onClick={() => editExpense(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => deleteExpense(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </ul>

        {/* EMI Calculator */}
        <Typography variant="h5" style={{ marginTop: "30px" }}>
          EMI Calculator
        </Typography>
        <Grid container spacing={2} columns={16}>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Loan Amount ($)"
              variant="outlined"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              InputLabelProps={{ style: { color: "#ffffff" } }}
              InputProps={{ style: { color: "#ffffff", borderColor: "#ffffff" } }}
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Interest Rate (%)"
              variant="outlined"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              InputLabelProps={{ style: { color: "#ffffff" } }}
              InputProps={{ style: { color: "#ffffff", borderColor: "#ffffff" } }}
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Loan Tenure (Years)"
              variant="outlined"
              type="number"
              value={loanTenure}
              onChange={(e) => setLoanTenure(e.target.value)}
              InputLabelProps={{ style: { color: "#ffffff" } }}
              InputProps={{ style: { color: "#ffffff", borderColor: "#ffffff" } }}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          onClick={calculateEMI}
          style={{ marginTop: "20px" }}
        >
          Calculate EMI
        </Button>

        {emi !== null && (
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Your Monthly EMI: <strong>${emi}</strong>
          </Typography>
        )}

        {/* Currency Conversion Section */}
        <Typography variant="h5" style={{ marginTop: "30px" }}>
          Currency Conversion
        </Typography>
        <Grid container spacing={2} columns={16}>
          <Grid item xs={8}>
            <Select
              fullWidth
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              variant="outlined"
              style={{ color: "#ffffff", borderColor: "#ffffff" }}
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
              <MenuItem value="INR">INR</MenuItem>
              <MenuItem value="JPY">JPY</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={8}>
            <Select
              fullWidth
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              variant="outlined"
              style={{ color: "#ffffff", borderColor: "#ffffff" }}
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
              <MenuItem value="INR">INR</MenuItem>
              <MenuItem value="JPY">JPY</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          onClick={convertExpenses}
          style={{ marginTop: "20px" }}
        >
          Convert Expenses
        </Button>
      </Paper>
    </Container>
  );
};

export default ExpenseTracker;