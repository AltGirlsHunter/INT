const express = require('express');
const router = express.Router();
const User = require('../models/User');
const controller = require('../controller/auth-controller');

router.get('/register', controller.registerForm);

router.post('/register', controller.register);

router.get('/login', controller.loginForm);

router.post('/login', controller.login);

router.get('/logout', controller.logout);

module.exports = router;