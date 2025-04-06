import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

export default router; 