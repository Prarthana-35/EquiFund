import { evaluateTwitterProfile } from './twitterService.js';
import CreditScore from '../models/creditScoreModel.js';

// Cache recent evaluations to avoid duplicate API calls
const evaluationCache = new Map();

export const evaluateCredit = async (username) => {
  const cacheKey = username.toLowerCase();
  
  // Check cache first
  if (evaluationCache.has(cacheKey)) {
    const cached = evaluationCache.get(cacheKey);
    if (Date.now() - cached.timestamp < 15 * 60 * 1000) { // 15 min cache
      return cached.data;
    }
  }

  try {
    // 1. Get Twitter reputation analysis
    const twitterAnalysis = await evaluateTwitterProfile(username);
    
    // 2. Calculate credit score with more sophisticated algorithm
    const baseScore = twitterAnalysis.creditScore * 0.6;
    const engagementScore = Math.min(
      200,
      (Math.log10(twitterAnalysis.analysisDetails.averageLikes + 1) * 30) +
      (Math.log10(twitterAnalysis.analysisDetails.averageRetweets + 1) * 30)
    );
    const consistencyScore = twitterAnalysis.analysisDetails.tweetCount > 100 ? 40 : 20;
    
    const creditScore = Math.min(850, Math.max(300, 
      baseScore + engagementScore + consistencyScore
    ));
    
    // 3. Save to database
    const creditScoreDoc = new CreditScore({
      username: cacheKey,
      score: Math.round(creditScore),
      components: {
        twitterScore: twitterAnalysis.creditScore,
        sentiment: twitterAnalysis.sentimentScore,
        credibility: twitterAnalysis.credibilityScore
      },
      analysisDetails: twitterAnalysis.analysisDetails
    });
    
    await creditScoreDoc.save();
    
    const result = {
      creditScore: Math.round(creditScore),
      riskCategory: creditScore > 700 ? 'Low' : 
                   creditScore > 600 ? 'Medium' : 'High',
      twitterAnalysis,
      lastUpdated: new Date().toISOString(),
      cached: false
    };
    
    // Cache the result
    evaluationCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
  } catch (err) {
    console.error('Credit evaluation error:', err);
    
    // If Twitter API failed, try to return the most recent from database
    if (err.code === 'ETIMEDOUT' || err.code === 'ERR_BAD_REQUEST') {
      const lastEvaluation = await CreditScore.findOne({
        username: cacheKey
      }).sort({ lastUpdated: -1 });
      
      if (lastEvaluation) {
        return {
          creditScore: lastEvaluation.score,
          riskCategory: lastEvaluation.score > 700 ? 'Low' : 
                       lastEvaluation.score > 600 ? 'Medium' : 'High',
          twitterAnalysis: {
            creditScore: lastEvaluation.components.twitterScore,
            sentimentScore: lastEvaluation.components.sentiment,
            credibilityScore: lastEvaluation.components.credibility,
            analysisDetails: lastEvaluation.analysisDetails
          },
          lastUpdated: lastEvaluation.lastUpdated.toISOString(),
          cached: true,
          warning: 'Using cached data due to API limitations'
        };
      }
    }
    
    throw err;
  }
};