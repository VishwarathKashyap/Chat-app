const express = require('express');
const { protect } = require('../middleware/auth');
const {
  accessChat,
  fetchChats,
  createGroupChat,
} = require('../controllers/chatController');

const router = express.Router();

router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);

module.exports = router;