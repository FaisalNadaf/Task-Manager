const express = require('express');
const router = express.Router();
const { register, login, logoutUser } = require('../controllers/authController');
// @route   POST /api/auth/register
// @desc    Register new user
router.post('/register', register);
// @route   POST /api/auth/login
// @desc    Login user and return JWT
router.post('/login', login);
// @route   POST /api/auth/logout
// @desc    Logout user (handled mostly client-side)
router.post('/logout', logoutUser);
module.exports = router;
