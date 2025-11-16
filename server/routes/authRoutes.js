const router = require('express').Router();
const { register, login, logout } = require('../controllers/authController');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Logout
router.post('/logout', logout);

module.exports = router;