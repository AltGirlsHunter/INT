const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

router.get('/register', authService.getRegister);

router.post('/register', authService.postRegister);

router.get('/login', authService.getLogin);

router.post('/login', authService.postLogin);

router.post('/logout', authService.getLogout);

module.exports = router;
