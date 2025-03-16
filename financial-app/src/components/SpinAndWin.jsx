import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { Button, Box, Typography } from '@mui/material';

const SpinAndWin = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [reward, setReward] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [canSpin, setCanSpin] = useState(true);

  const segments = [
    { label: 'Free Spin', value: 0 },
    { label: '10 Coins', value: 10 },
    { label: '20 Coins', value: 20 },
    { label: '50 Coins', value: 50 },
    { label: '100 Coins', value: 100 },
    { label: 'Golden Spin', value: 200 }
  ];

  useEffect(() => {
    const savedScore = localStorage.getItem('totalScore');
    const lastSpinDate = localStorage.getItem('lastSpinDate');
    const today = new Date().toISOString().split('T')[0];

    if (savedScore) setTotalScore(parseInt(savedScore, 10));
    if (lastSpinDate === today) setCanSpin(false);
  }, []);

  const spinWheel = () => {
    if (!canSpin || spinning) return;

    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * segments.length);
    const newRotation = 360 * 5 + randomIndex * (360 / segments.length);
    setRotation((prev) => prev + newRotation);

    setTimeout(() => {
      const wonPrize = segments[randomIndex];
      setReward(wonPrize.label);
      setShowConfetti(true);

      const newTotal = totalScore + wonPrize.value;
      setTotalScore(newTotal);
      localStorage.setItem('totalScore', newTotal);
      localStorage.setItem('lastSpinDate', new Date().toISOString().split('T')[0]);

      setCanSpin(false);
      setSpinning(false);
      setTimeout(() => setShowConfetti(false), 4000);
    }, 3000);
  };

  const wheelSize = 300;
  const numSegments = segments.length;
  const segmentAngle = 360 / numSegments;

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
        Spin & Win Finance Wheel 🎡
      </Typography>

      <Typography variant="h6" sx={{ mb: 2, color: '#16a085' }}>
        Your Total Score: {totalScore} Coins 🏆
      </Typography>

      {/* Wheel Container */}
      <Box
        sx={{
          position: 'relative',
          width: wheelSize,
          height: wheelSize,
          margin: '0 auto',
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 3s ease-out',
        }}
      >
        <svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
          {/* Background Circle */}
          <circle cx={wheelSize / 2} cy={wheelSize / 2} r={wheelSize / 2 - 5} fill="#f1c40f" stroke="#333" strokeWidth="5" />

          {/* Partition Lines */}
          {segments.map((_, index) => {
            const angle = index * segmentAngle;
            const x = (wheelSize / 2) + (wheelSize / 2) * Math.cos((angle * Math.PI) / 180);
            const y = (wheelSize / 2) + (wheelSize / 2) * Math.sin((angle * Math.PI) / 180);
            return <line key={index} x1={wheelSize / 2} y1={wheelSize / 2} x2={x} y2={y} stroke="#333" strokeWidth="3" />;
          })}

          {/* Prize Labels */}
          {segments.map((segment, index) => {
            const angle = (index * segmentAngle) + segmentAngle / 2;
            const x = (wheelSize / 2) + (wheelSize / 3) * Math.cos((angle * Math.PI) / 180);
            const y = (wheelSize / 2) + (wheelSize / 3) * Math.sin((angle * Math.PI) / 180);
            return (
              <text
                key={index}
                x={x}
                y={y}
                fontSize="16"
                fontWeight="bold"
                fill={index % 2 === 0 ? '#2c3e50' : '#e74c3c'}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${angle - 90}, ${x}, ${y})`}
              >
                {segment.label}
              </text>
            );
          })}
        </svg>

        {/* Pointer Arrow */}
        <Box
          sx={{
            position: 'absolute',
            top: '-15px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderBottom: '30px solid red',
          }}
        />
      </Box>

      {/* Spin Button */}
      <Button
        variant="contained"
        sx={{
          mt: 3,
          fontSize: '18px',
          fontWeight: 'bold',
          background: canSpin ? '#f39c12' : '#bdc3c7',
          color: '#fff',
          '&:hover': canSpin ? { background: '#e67e22', boxShadow: '0 0 15px #f1c40f' } : {},
        }}
        onClick={spinWheel}
        disabled={!canSpin}
      >
        {canSpin ? 'Spin the Wheel!' : 'Come Back Tomorrow!'}
      </Button>

      {showConfetti && <Confetti />}
    </Box>
  );
};

export default SpinAndWin;
