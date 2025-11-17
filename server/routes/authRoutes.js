const router = require('express').Router();
const { register, login, logout, forgotPassword, resetPassword } = require('../controllers/authController');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Logout
router.post('/logout', logout);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password', resetPassword);

module.exports = router;