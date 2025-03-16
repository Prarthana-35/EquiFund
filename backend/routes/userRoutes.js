const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

module.exports = router;