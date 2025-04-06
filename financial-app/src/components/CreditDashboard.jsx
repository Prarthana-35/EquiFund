import React, { useState } from 'react';
import {
  Box, Typography, CardContent, Grid,
  Paper, Divider, Chip, Tabs, Tab
} from '@mui/material';
import {
  CreditScore, VerifiedUser,
  ShowChart, Timeline, Warning, Dangerous
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, 
         CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CreditDashboard = ({ evaluation, history, transactionData }) => {
  const [activeTab, setActiveTab] = useState(0);

  const getRiskColor = (score) => {
    if (!score) return 'grey.500';
    return score > 700 ? 'success.main' : score > 600 ? 'warning.main' : 'error.main';
  };

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const renderScoreCard = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Credit Assessment</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box textAlign="center">
            <Typography variant="subtitle1">Credit Score</Typography>
            <Typography variant="h2" sx={{ 
              color: getRiskColor(evaluation?.combinedCreditScore),
              fontWeight: 'bold',
              my: 2
            }}>
              {evaluation?.combinedCreditScore || 'N/A'}
            </Typography>
            <Chip 
              label={`${evaluation?.riskCategory || 'Unknown'} Risk`} 
              color={
                evaluation?.riskCategory === 'Low' ? 'success' : 
                evaluation?.riskCategory === 'Medium' ? 'warning' : 'error'
              }
              icon={
                evaluation?.riskCategory === 'Low' ? <CreditScore /> :
                evaluation?.riskCategory === 'Medium' ? <Warning /> : <Dangerous />
              }
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box textAlign="center">
            <Typography variant="subtitle1">Repayment Probability</Typography>
            <Typography variant="h2" sx={{ 
              color: evaluation?.repaymentProbability > 0.7 ? 'success.main' : 
                    evaluation?.repaymentProbability > 0.5 ? 'warning.main' : 'error.main',
              fontWeight: 'bold',
              my: 2
            }}>
              {evaluation ? `${Math.round(evaluation.repaymentProbability * 100)}%` : 'N/A'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderRepaymentChart = () => (
    <Box sx={{ height: 400, mt: 3 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={[
          { name: 'Low Risk', value: 0.8 },
          { name: 'Medium Risk', value: 0.6 },
          { name: 'High Risk', value: 0.4 },
          { name: 'Your Score', value: evaluation?.repaymentProbability || 0 },
        ]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 1]} />
          <Tooltip formatter={(value) => [`${(value * 100).toFixed(1)}%`]} />
          <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );

  const renderTransactionPatterns = () => {
    const processedData = transactionData?.reduce((acc, txn) => {
      if (!acc[txn.type]) acc[txn.type] = { count: 0, total: 0 };
      acc[txn.type].count++;
      acc[txn.type].total += txn.amount;
      return acc;
    }, {});

    const chartData = processedData ? Object.keys(processedData).map(type => ({
      name: type,
      count: processedData[type].count,
      average: processedData[type].total / processedData[type].count
    })) : [];

    return (
      <Box sx={{ height: 400, mt: 3 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Count" />
            <Bar yAxisId="right" dataKey="average" fill="#82ca9d" name="Average" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  return (
    <CardContent>
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Overview" icon={<VerifiedUser />} />
        <Tab label="Repayment" icon={<ShowChart />} />
        <Tab label="Transactions" icon={<Timeline />} />
      </Tabs>

      {activeTab === 0 && (
        <>
          {renderScoreCard()}
          <Typography variant="body1">
            {evaluation ? `This user has ${evaluation.riskCategory.toLowerCase()} credit risk.` : 'No data available.'}
          </Typography>
        </>
      )}

      {activeTab === 1 && renderRepaymentChart()}
      {activeTab === 2 && renderTransactionPatterns()}
    </CardContent>
  );
};

export default CreditDashboard;