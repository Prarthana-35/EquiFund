import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1E1E1E" },
    secondary: { main: "#D68910" },
  },
  typography: { fontFamily: "Arial" },
  color: "#ffffff",
});

const InvestmentPortfolio = () => {
  const [investments, setInvestments] = useState([]);
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [monthlyInvestment, setMonthlyInvestment] = useState("");
  const [investmentDuration, setInvestmentDuration] = useState("");
  const [annualReturnRate, setAnnualReturnRate] = useState("");
  const [futureValue, setFutureValue] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  const addInvestment = () => {
    setInvestments([
      ...investments,
      { name, ticker, quantity: Number(quantity), purchasePrice: Number(purchasePrice), purchaseDate },
    ]);
    setName("");
    setTicker("");
    setQuantity("");
    setPurchasePrice("");
    setPurchaseDate("");
  };

  const deleteInvestment = (index) => {
    setInvestments(investments.filter((_, i) => i !== index));
    alert("Investment deleted!");
  };

  const calculateSIP = () => {
    const P = parseFloat(monthlyInvestment);
    const r = parseFloat(annualReturnRate) / 100 / 12;
    const n = parseFloat(investmentDuration) * 12;
    if (P && r && n) setFutureValue((P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)).toFixed(2));
    else alert("Please fill all fields!");
  };

  const analyzeInvestment = async () => {
    if (!ticker) {
      alert("Please enter a valid ticker symbol.");
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze', {
        ticker,
        start_date: startDate,
        end_date: endDate,
      });
      setAnalysisResult(response.data);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error); // Display the error message
      } else {
        console.error('Error analyzing investment:', error);
        alert('Failed to analyze investment. Check the console for details.');
      }
    }
  };
  
  const predictInvestment = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        ticker,
        days,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Prediction Result:', response.data); // Log the response
      setPredictionResult(response.data);
    } catch (error) {
      console.error('Error predicting investment:', error.response ? error.response.data : error.message);
      alert('Failed to predict investment. Check the console for details.');
    }
  };
  
  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ padding: "20px", maxWidth: "900px", margin: "auto", color: "#fff" }}>
        <Typography variant="h4" gutterBottom align="center">
          Investment Portfolio
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Add Investment
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}><TextField label="Investment Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} /></Grid>
                  <Grid item xs={6}><TextField label="Ticker Symbol" fullWidth value={ticker} onChange={(e) => setTicker(e.target.value)} /></Grid>
                  <Grid item xs={4}><TextField type="number" label="Quantity" fullWidth value={quantity} onChange={(e) => setQuantity(e.target.value)} /></Grid>
                  <Grid item xs={4}><TextField type="number" label="Purchase Price" fullWidth value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} /></Grid>
                  <Grid item xs={4}><TextField type="date" fullWidth value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} /></Grid>
                </Grid>
                <Button onClick={addInvestment} variant="contained" color="primary" fullWidth style={{ marginTop: "10px" }}>
                  Add Investment
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Your Portfolio</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Ticker</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Purchase Price</TableCell>
                    <TableCell>Purchase Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {investments.map((inv, index) => (
                    <TableRow key={index}>
                      <TableCell>{inv.name}</TableCell>
                      <TableCell>{inv.ticker}</TableCell>
                      <TableCell>{inv.quantity}</TableCell>
                      <TableCell>${inv.purchasePrice.toFixed(2)}</TableCell>
                      <TableCell>{inv.purchaseDate}</TableCell>
                      <TableCell>
                        <Button onClick={() => deleteInvestment(index)} color="secondary">Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">SIP Calculator</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}><TextField label="Monthly Investment" fullWidth value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(e.target.value)} /></Grid>
              <Grid item xs={4}><TextField label="Investment Duration (Years)" fullWidth value={investmentDuration} onChange={(e) => setInvestmentDuration(e.target.value)} /></Grid>
              <Grid item xs={4}><TextField label="Annual Return Rate (%)" fullWidth value={annualReturnRate} onChange={(e) => setAnnualReturnRate(e.target.value)} /></Grid>
            </Grid>
            <Button onClick={calculateSIP} variant="contained" color="primary" fullWidth style={{ marginTop: "10px" }}>
              Calculate SIP
            </Button>
            {futureValue && <Typography mt={2}>Future Value: ${futureValue}</Typography>}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Investment Analysis</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}><TextField label="Ticker" fullWidth value={ticker} onChange={(e) => setTicker(e.target.value)} /></Grid>
              <Grid item xs={4}><TextField type="date" label="Start Date" fullWidth value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
              <Grid item xs={4}><TextField type="date" label="End Date" fullWidth value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
            </Grid>
            <Button onClick={analyzeInvestment} variant="contained" color="primary" fullWidth style={{ marginTop: "10px" }}>
              Analyze
            </Button>
            {analysisResult && (
            <div style={{ marginTop: "10px" }}>
                <Typography>Ticker: {analysisResult.ticker}</Typography>
                <Typography>ROI: {analysisResult.roi.toFixed(2)}%</Typography>
                <Typography>Volatility: {analysisResult.volatility.toFixed(4)}</Typography>
              </div>
            )}        
            </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Investment Prediction</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField label="Ticker" fullWidth value={ticker} onChange={(e) => setTicker(e.target.value)} /></Grid>
              <Grid item xs={6}><TextField type="number" label="Days to Predict" fullWidth value={days} onChange={(e) => setDays(e.target.value)} /></Grid>
            </Grid>
            <Button onClick={predictInvestment} variant="contained" color="primary" fullWidth style={{ marginTop: "10px" }}>
              Predict
            </Button>
            {predictionResult && <Typography mt={2}>Future Prices: {predictionResult.future_prices.join(", ")}</Typography>}
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};
export default InvestmentPortfolio;
