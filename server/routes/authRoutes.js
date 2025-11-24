const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Register validation
const registerValidation = [
  body('name').notEmpty().trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

// Login validation
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Register route
router.post('/register', registerValidation, authController.register);

// Login route
router.post('/login', loginValidation, authController.login);

// Get profile (protected route)
router.get('/profile', auth, authController.getProfile);

module.exports = router;