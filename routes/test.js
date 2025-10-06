const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET /test-mongo
router.get('/test-mongo', async (req, res) => {
  try {
    const users = await User.find().limit(5); // Fetch 5 users
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
