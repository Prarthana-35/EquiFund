import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const ExpenseChart = ({ expenses }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const categories = {};
    expenses.forEach((expense) => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += Number(expense.amount);
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
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
            ],
            borderColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [expenses]); 

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default ExpenseChart;
