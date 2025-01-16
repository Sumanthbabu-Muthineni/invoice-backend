const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateRequest } = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getMe
} = require('../controllers/authController');

// Register/Signup route
router.post(
  '/signup',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('email', 'Please include a valid email')
      .isEmail()
      .normalizeEmail(),
    check('password', 'Please enter a password with 6 or more characters')
      .isLength({ min: 6 })
  ],
  validateRequest,
  register
);

// Login route
router.post(
  '/login',
  [
    check('email', 'Please include a valid email')
      .isEmail()
      .normalizeEmail(),
    check('password', 'Password is required')
      .exists()
  ],
  validateRequest,
  login
);

// Get current user route
router.get('/me', protect, getMe);

/* Comment out these optional routes until you implement their handlers
router.post(
  '/forgot-password',
  [
    check('email', 'Please include a valid email')
      .isEmail()
      .normalizeEmail()
  ],
  validateRequest,
  forgotPassword  // You'll need to implement this handler
);

router.post(
  '/verify-email',
  [
    check('token', 'Verification token is required')
      .not()
      .isEmpty()
  ],
  validateRequest,
  verifyEmail  // You'll need to implement this handler
);
*/

module.exports = router;