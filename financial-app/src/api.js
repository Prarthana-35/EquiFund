import { fetchTweets, analyzeSentiment } from '../../backend/services/twitterService';
// import { fetchTweets, analyzeSentiment } from './twitterService.js'; 
import axios from 'axios';

export const evaluateCredit = async (username, locationQuery) => {
  try {
    const tweets = await fetchTweets(username);
    const sentimentScore = analyzeSentiment(tweets);

    const osmResponse = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}`
    );
    const locationData = osmResponse.data[0];

    const credibilityScore = locationData ? 80 : 50;
    const creditScore = (sentimentScore + credibilityScore) / 2;

    return { creditScore, sentimentScore, credibilityScore };
  } catch (error) {
    console.error('Error evaluating credit:', error);
    throw error;
  }
};
