const express = require('express');
const { registerUser, loginUser, searchUsers, logoutUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    await registerUser(req, res);
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    await loginUser(req, res);
  } catch (err) {
    res.status(500).json({ message: 'Error logging in user', error: err.message });
  }
});

router.get('/search', protect, searchUsers);

router.post('/logout', protect, async (req, res) => {
  try {
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error logging out user', error: err.message });
  }
});

module.exports = router;
