import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import Sentiment from 'sentiment';
import mongoose from 'mongoose';
dotenv.config();

const appOnlyClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
const sentimentAnalyzer = new Sentiment();

// Create cache model
const TwitterCacheSchema = new mongoose.Schema({
  username: { type: String, required: true, index: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  expiresAt: { type: Date, required: true, index: true }
}, { timestamps: true });

const TwitterCache = mongoose.models.TwitterCache || mongoose.model('TwitterCache', TwitterCacheSchema);

// Cache in memory for quick access
const memoryCache = new Map();

export const evaluateTwitterProfile = async (username) => {
  const cacheKey = username.toLowerCase();
  
  // Check memory cache first
  if (memoryCache.has(cacheKey)) {
    const cached = memoryCache.get(cacheKey);
    if (Date.now() < cached.expiresAt) {
      return cached.data;
    }
  }

    // Check database cache
    const cachedData = await TwitterCache.findOne({
      username: cacheKey,
      expiresAt: { $gt: new Date() }
    }).lean();
    
    if (cachedData) {
      // Store in memory cache
      memoryCache.set(cacheKey, {
        data: cachedData.data,
        expiresAt: cachedData.expiresAt
      });
      return cachedData.data;
    }
    
    try {
      // Get fresh data from Twitter API
      const user = await appOnlyClient.v2.userByUsername(username, {
        'user.fields': ['public_metrics', 'verified', 'created_at']
      });
      const timeline = await appOnlyClient.v2.userTimeline(user.data.id, {
        max_results: 50,
        'tweet.fields': ['created_at', 'public_metrics', 'text']
      });
  
      if (!timeline.data?.data) {
        throw new Error('No tweets found for analysis');
      }
      
      // Calculate scores
      const sentimentScore = analyzeSentiment(timeline.data.data);
      const credibilityScore = await calculateCredibility(user.data);
      const creditScore = (sentimentScore * 0.4) + (credibilityScore * 0.6);

      const result = {
        username,
        creditScore: Math.round(creditScore),
        sentimentScore: Math.round(sentimentScore),
        credibilityScore: Math.round(credibilityScore),
        analysisDetails: {
          tweetCount: timeline.data.data.length,
          averageLikes: timeline.data.data.reduce((sum, t) => sum + t.public_metrics.like_count, 0) / timeline.data.data.length,
          averageRetweets: timeline.data.data.reduce((sum, t) => sum + t.public_metrics.retweet_count, 0) / timeline.data.data.length
        }
      };
      
      // Cache the result (15 minutes)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
      
      await TwitterCache.findOneAndUpdate(
        { username: cacheKey },
        { 
          data: result,
          expiresAt 
        },
        { upsert: true, new: true }
      );
          // Store in memory cache
    memoryCache.set(cacheKey, {
      data: result,
      expiresAt: expiresAt.getTime()
    });
    
    return result;
  } catch (err) {
    console.error('Twitter API error:', err);
    
    // Try to return most recent cached data if API fails
    const lastCache = await TwitterCache.findOne({
      username: cacheKey
    }).sort({ createdAt: -1 });
    
    if (lastCache) {
      return lastCache.data;
    }
    
    throw err;
  }
};

// Fetch tweets for a given username
export const fetchTweets = async (username) => {
  try {
    // Get user ID first
    const user = await appOnlyClient.v2.userByUsername(username);
    
    // Get user timeline
    const timeline = await appOnlyClient.v2.userTimeline(user.data.id, {
      max_results: 50,
      'tweet.fields': ['created_at', 'public_metrics', 'text']
    });

    if (!timeline.data?.data) {
      throw new Error('No tweets found');
    }

    return timeline.data.data;
  } catch (err) {
    console.error('Error fetching tweets:', err);
    throw err;
  }
};

// Analyze sentiment of tweets
export const analyzeSentiment = (tweets) => {
  if (!tweets?.length) return 50;

  let totalScore = 0;
  let analyzedTweets = 0;

  tweets.forEach(tweet => {
    try {
      const result = sentimentAnalyzer.analyze(tweet.text);
      // Convert from -5 to 5 scale to 0-100
      totalScore += ((result.score + 5) / 10) * 100;
      analyzedTweets++;
    } catch (err) {
      console.error('Error analyzing tweet:', err);
    }
  });

  return analyzedTweets > 0 ? 
    Math.max(0, Math.min(100, totalScore / analyzedTweets)) : 
    50;
};

// Calculate user credibility
export const calculateCredibility = async (userId) => {
  try {
    const user = await appOnlyClient.v2.user(userId, {
      'user.fields': ['verified', 'public_metrics', 'created_at']
    });

    const baseScore = user.data.verified ? 70 : 50;
    const followerScore = Math.min(30, Math.log10(user.data.public_metrics.followers_count + 1) * 10);
    const accountAgeScore = Math.min(20, (new Date() - new Date(user.data.created_at)) / (1000 * 60 * 60 * 24 * 365) * 2);

    return baseScore + followerScore + accountAgeScore;
  } catch (err) {
    console.error('Credibility calculation error:', err);
    return 50;
  }
};
