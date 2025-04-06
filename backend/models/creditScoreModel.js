import mongoose from 'mongoose';

const creditScoreSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  score: {
    type: Number,
    required: true,
    min: 300,
    max: 850
  },
  components: {
    twitterScore: Number,
    sentiment: Number,
    credibility: Number
  },
  analysisDetails: {
    tweetCount: Number,
    averageLikes: Number,
    averageRetweets: Number
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

const CreditScore = mongoose.model('CreditScore', creditScoreSchema);

export default CreditScore;