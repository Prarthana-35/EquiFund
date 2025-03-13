import React, { useState } from 'react';
import axios from 'axios';

const InvestmentPortfolio = () => {
  const [investments, setInvestments] = useState([]);
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');

  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [investmentDuration, setInvestmentDuration] = useState('');
  const [annualReturnRate, setAnnualReturnRate] = useState('');
  const [futureValue, setFutureValue] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  const addInvestment = () => {
    const newInvestment = {
      name,
      ticker,
      quantity: Number(quantity),
      purchasePrice: Number(purchasePrice),
      purchaseDate,
    };
    setInvestments([...investments, newInvestment]);
    setName('');
    setTicker('');
    setQuantity('');
    setPurchasePrice('');
    setPurchaseDate('');
  };

  const deleteInvestment = (index) => {
    const updatedInvestments = investments.filter((_, i) => i !== index);
    setInvestments(updatedInvestments);
    alert('Investment deleted!');
  };

  const calculateSIP = () => {
    const P = parseFloat(monthlyInvestment); 
    const r = parseFloat(annualReturnRate) / 100 / 12; 
    const n = parseFloat(investmentDuration) * 12; 

    if (P && r && n) {
      const futureValue =
        P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r); 
      setFutureValue(futureValue.toFixed(2)); 
    } else {
      alert('Please fill all fields!');
    }
  };

  const analyzeInvestment = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze', {
        ticker,
        start_date: startDate,
        end_date: endDate,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Error analyzing investment:', error);
      alert('Failed to analyze investment');
    }
  };

    const predictInvestment = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/predict', {
          ticker,
          days,
        },{
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setPredictionResult(response.data);
      } catch (error) {
        console.error('Error predicting investment:', error);
        alert('Failed to predict investment');
      }
    };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Investment Portfolio</h2>
      <p className="mb-6">Track your investments and analyze your portfolio.</p>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Add Investment</h3>
        <div className="space-y-4">
          <input type="text" placeholder="Investment Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded"/>
          <input type="text" placeholder="Ticker Symbol" value={ticker} onChange={(e) => setTicker(e.target.value)} className="w-full p-2 border rounded" />
          <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full p-2 border rounded" />
          <input type="number" placeholder="Purchase Price" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className="w-full p-2 border rounded" />
          <input type="date" placeholder="Purchase Date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className="w-full p-2 border rounded" />
          <button onClick={addInvestment} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Investment</button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Your Portfolio</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Ticker</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Purchase Price</th>
              <th className="p-2 border">Purchase Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((investment, index) => (
              <tr key={index} className="border">
                <td className="p-2 border">{investment.name}</td>
                <td className="p-2 border">{investment.ticker}</td>
                <td className="p-2 border">{investment.quantity}</td>
                <td className="p-2 border">${investment.purchasePrice.toFixed(2)}</td>
                <td className="p-2 border">{investment.purchaseDate}</td>
                <td className="p-2 border">
                  <button onClick={() => deleteInvestment(index)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">SIP Calculator</h3>
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Monthly Investment Amount ($)"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Investment Duration (Years)"
            value={investmentDuration}
            onChange={(e) => setInvestmentDuration(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Expected Annual Return Rate (%)"
            value={annualReturnRate}
            onChange={(e) => setAnnualReturnRate(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={calculateSIP}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Calculate SIP
          </button>
        </div>
        {futureValue !== null && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h4 className="text-lg font-semibold">SIP Calculation Result</h4>
            <p className="mt-2">
              Future Value of Your Investment: <strong>${futureValue}</strong>
            </p>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Investment Analysis</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Analyze Investment</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Ticker Symbol"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button type="button"
            onClick={(e) => {
              e.preventDefault(); 
              analyzeInvestment();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Analyze
          </button>
        </div>
        {analysisResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h4 className="text-lg font-semibold">Analysis Result</h4>
            <p className="mt-2">
              Ticker: <strong>{analysisResult.ticker}</strong>
            </p>
            <p className="mt-2">
              ROI: <strong>{analysisResult.roi}%</strong>
            </p>
            <p className="mt-2">
              Volatility: <strong>{analysisResult.volatility}</strong>
            </p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Predict Investment</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Ticker Symbol"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Days to Predict"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button type="button"
            onClick={(e) => {
              e.preventDefault(); 
              predictInvestment();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Predict
          </button>
        </div>
        {predictionResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h4 className="text-lg font-semibold">Prediction Result</h4>
            <p className="mt-2">
              Ticker: <strong>{predictionResult.ticker}</strong>
            </p>
            <p className="mt-2">
              Future Prices: <strong>{predictionResult.future_prices.join(', ')}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentPortfolio;