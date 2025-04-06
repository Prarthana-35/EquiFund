import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1, 
  message: {
    success: false,
    message: 'Too many requests, please try again after 15 minutes',
    retryAfter: 15 * 60 
  },
  standardHeaders: true,
  legacyHeaders: false,
});