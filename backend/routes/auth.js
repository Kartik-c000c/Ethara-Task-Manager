const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerRules, loginRules, validateRequest } = require('../middleware/validation');

const router = express.Router();

router.post('/register', registerRules, validateRequest, registerUser);
router.post('/login', loginRules, validateRequest, loginUser);
router.get('/me', protect, getMe);

module.exports = router;
