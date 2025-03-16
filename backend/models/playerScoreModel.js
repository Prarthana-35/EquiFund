const mongoose = require('mongoose');

const playerScoreSchema = mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  roundsWon: {
    type: Number,
    default: 0,
  },
  isEliminated: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('PlayerScore', playerScoreSchema);