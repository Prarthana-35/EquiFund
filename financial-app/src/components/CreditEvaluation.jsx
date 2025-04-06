import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, 
  Grid, Paper, LinearProgress, Alert,
  Button, TextField
} from '@mui/material';
import { Analytics } from '@mui/icons-material';
import axios from 'axios';
import CreditDashboard from './CreditDashboard';

const CreditEvaluation = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [history, setHistory] = useState([]);
  const [transactionData, setTransactionData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/credit/evaluate', 
        { username }
      );
      
      setEvaluation(response.data.data);
      fetchHistory(username);
      fetchTransactionData(username);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to evaluate credit');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/credit/history/${username}`
      );
      setHistory(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setHistory([]);
    }
  };
  
  const fetchTransactionData = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/credit/transactions/${username}`
      );
      setTransactionData(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch transaction data:', err);
      setTransactionData([]);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        AI-Powered Credit Evaluation
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Evaluate Credit Profile
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{ mb: 2 }}
                  disabled={isLoading}
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  startIcon={<Analytics />}
                >
                  {isLoading ? 'Analyzing...' : 'Evaluate Credit'}
                </Button>
              </form>
              
              {isLoading && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress />
                  <Typography variant="caption" sx={{ mt: 1 }}>
                    Analyzing profile and transaction patterns...
                  </Typography>
                </Box>
              )}
              
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <CreditDashboard 
            evaluation={evaluation}
            history={history}
            transactionData={transactionData}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreditEvaluation;