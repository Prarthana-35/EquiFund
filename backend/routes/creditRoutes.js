import express from 'express';
import { evaluateCredit } from '../services/creditEvaluation.js';
import CreditScore from '../models/creditScoreModel.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Add caching middleware
const cache = new Map();

const checkCache = (req, res, next) => {
  const { username } = req.body;
  const cacheKey = `eval_${username.toLowerCase()}`;
  
  if (cache.has(cacheKey)) {
    const cachedData = cache.get(cacheKey);
    if (Date.now() - cachedData.timestamp < 15 * 60 * 1000) { // 15 min cache
      return res.json(cachedData.data);
    }
  }
  next();
};

// Public endpoint with rate limiting and caching
router.post('/evaluate', rateLimiter, checkCache, async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ 
        success: false,
        message: 'Twitter username is required' 
      });
    }
    
    const evaluation = await evaluateCredit(username);
    
    // Cache the result
    const cacheKey = `eval_${username.toLowerCase()}`;
    cache.set(cacheKey, {
      data: { success: true, data: evaluation },
      timestamp: Date.now()
    });
    
    res.status(200).json({
      success: true,
      data: evaluation
    });
  } catch (err) {
    console.error('Error evaluating credit:', err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Error evaluating credit',
      code: err.code // Include error code if available
    });
  }
});

// Get history endpoint
router.get('/history/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const scores = await CreditScore.find({ 
      username: { $regex: new RegExp(username, 'i') }
    })
    .sort({ lastUpdated: -1 })
    .limit(10)
    .lean();
    
    res.status(200).json({
      success: true,
      count: scores.length,
      data: scores
    });
  } catch (err) {
    console.error('Error getting credit history:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error getting credit history',
      retryAfter: 15 * 60 // Inform client of rate limit
    });
  }
});

export default router;