const router = require('express').Router();
const { register, login, logout, forgotPassword, resetPassword, verifyToken } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Logout
router.post('/logout', logout);

// Verify Token (requires authentication)
router.get('/verify', auth, verifyToken);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password', resetPassword);

module.exports = router;