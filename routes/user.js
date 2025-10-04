const express = require('express');
const router = express.Router();

// ✅ Import controller functions
const { signup, login, getDashboard } = require('../controllers/usercontroller');

// ✅ Define routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/dashboard/:username', getDashboard);

module.exports = router;

