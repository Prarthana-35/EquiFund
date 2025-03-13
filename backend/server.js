// server.js
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
const userRoutes = require('./routes/userRoutes'); // Import userRoutes

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', userRoutes);

// Investment Analysis Route
app.post('/api/analyze', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5001/analyze', req.body);
    res.status(200).json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error analyzing investment' });
  }
});

// Predictive Analysis Route
app.post('/api/predict', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5001/predict', req.body);
    res.status(200).json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error predicting prices' });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../financial-app/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../financial-app/dist', 'index.html'));
  });
}

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('message', (data) => {
    console.log('Message received:', data);
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));