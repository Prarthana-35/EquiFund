import express from 'express';
import { fetchTweets, analyzeSentiment, evaluateTwitterProfile } from '../services/twitterService.js';

const router = express.Router();

// Get tweets for a user
router.get('/tweets/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const tweets = await fetchTweets(username);
    res.json({ tweets });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Analyze tweets sentiment
router.get('/analyze/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const tweets = await fetchTweets(username);
    const sentimentScore = analyzeSentiment(tweets);
    res.json({ sentimentScore });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Full profile evaluation
router.get('/evaluate/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const evaluation = await evaluateTwitterProfile(username);
    res.json(evaluation);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;