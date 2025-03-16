import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const ExpenseChart = ({ expenses }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');

    const categories = {};
    expenses.forEach((expense) => {
      categories[expense.category] = (categories[expense.category] || 0) + Number(expense.amount);
    });

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(categories),
        datasets: [
          {
            label: 'Expenses by Category',
            data: Object.values(categories),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { 
            ticks: { autoSkip: false }, // Prevents skipping labels
          },
          y: { beginAtZero: true },
        },
      },
    });
  }, [expenses]);

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      width: '100%', height: '400px', overflowX: 'auto' // Enables scrolling if too large
    }}>
      <div style={{ width: Math.max(expenses.length * 60, 400), height: '100%' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ExpenseChart;
