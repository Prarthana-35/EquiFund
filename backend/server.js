import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import axios from 'axios';
import admin from 'firebase-admin';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import creditRoutes from './routes/creditRoutes.js';
import twitterRoutes from './routes/twitterRoutes.js';

// Get current module path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account
const serviceAccount = JSON.parse(readFileSync(path.join(__dirname, 'config', 'serviceAccountKey.json')));

// Initialize environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Get Firestore instance
const db = admin.firestore();

// Create Express app
const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling']
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/twitter', twitterRoutes);
app.use('/api/credit', creditRoutes);

// Production static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../financial-app/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../financial-app/dist', 'index.html'));
  });
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Game state
  let players = [];
  let leaderboard = [];
  let currentRound = 1;
  let questions = [];

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('https://opentdb.com/api.php?amount=10&category=18&type=multiple');
      questions = response.data.results;
    } catch (err) {
      console.error('Error fetching questions:', err);
      questions = [];
    }
  };

  const startGame = async () => {
    await fetchQuestions();
    io.emit('startGame', { 
      round: currentRound, 
      players, 
      question: questions[currentRound - 1] 
    });
  };

  const endRound = () => {
    const minScore = Math.min(...players.map(p => p.score));
    const eliminatedPlayers = players.filter(p => p.score === minScore);
    players = players.filter(p => p.score > minScore);

    eliminatedPlayers.forEach(player => {
      leaderboard.push({ name: player.name, score: player.score });
    });

    if (players.length === 1) {
      const winner = players[0];
      leaderboard.push({ name: winner.name, score: winner.score });
      io.emit('endGame', { winner, leaderboard });
      resetGame();
    } else {
      currentRound += 1;
      io.emit('updatePlayers', players);
      io.emit('startGame', { 
        round: currentRound, 
        players, 
        question: questions[currentRound - 1] 
      });
    }
  };

  const resetGame = () => {
    players = [];
    leaderboard = [];
    currentRound = 1;
  };

  // Socket events
  socket.on('joinGame', (playerName) => {
    players.push({ id: socket.id, name: playerName, score: 0 });
    io.emit('updatePlayers', players);

    if (players.length >= 2) {
      startGame();
    }
  });

  socket.on('answer', (isCorrect) => {
    const player = players.find(p => p.id === socket.id);
    if (isCorrect) {
      player.score += 1;
    }

    const allAnswered = players.every(p => p.score === currentRound);
    if (allAnswered) {
      endRound();
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    players = players.filter(p => p.id !== socket.id);
    io.emit('updatePlayers', players);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`MongoDB connected: ${mongoose.connection.host}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed', err);
    process.exit(1);
  });