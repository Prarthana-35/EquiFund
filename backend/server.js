const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const connectDB = require('./config/db');
const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');
const userRoutes = require('./routes/userRoutes');
const { addUsersToFirestore } = require('./config//firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// User Routes
app.use('/api/users', userRoutes);

app.post('/api/users/login', async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found in Firestore' });
    }

    res.status(200).json({ message: 'Login successful', user: userDoc.data() });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Failed to log in' });
  }
});

app.post('/api/users/register', async (req, res) => {
  const { uid, email, name } = req.body;

  try {
    await db.collection('users').doc(uid).set({
      email,
      name,
      createdAt: new Date(),
    });

    res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

app.post('/api/add-users', async (req, res) => {
  try {
    await addUsersToFirestore();
    res.status(200).json({ message: 'Users added to Firestore successfully' });
  } catch (err) {
    console.error('Error adding users to Firestore:', err);
    res.status(500).json({ message: 'Failed to add users to Firestore' });
  }
});

app.post('/api/analyze', async (req, res) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/analyze', req.body);
    res.status(200).json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error analyzing investment' });
  }
});

app.post('/api/predict', async (req, res) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/predict', req.body);
    res.status(200).json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error predicting prices' });
  }
});

app.get('/api/questions', async (req, res) => {
  try {
    const response = await axios.get('https://opentdb.com/api.php?amount=10&category=18&type=multiple');
    res.status(200).json(response.data.results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../financial-app/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../financial-app/dist', 'index.html'));
  });
}

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

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

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
    players = players.filter(p => p.id !== socket.id);
    io.emit('updatePlayers', players);
  });

  const startGame = async () => {
    await fetchQuestions();
    io.emit('startGame', { round: currentRound, players, question: questions[currentRound - 1] });
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
      io.emit('startGame', { round: currentRound, players, question: questions[currentRound - 1] });
    }
  };

  const resetGame = () => {
    players = [];
    leaderboard = [];
    currentRound = 1;
  };
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

