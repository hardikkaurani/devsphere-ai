const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');
const { registerSchema, loginSchema } = require('../utils/validationSchemas');

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

module.exports = router;

