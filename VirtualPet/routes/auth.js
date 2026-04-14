const express = require('express');
const router = express.Router();
const service = require('../services/authServices')


router.get('/register', service.getRegister);

router.post('/register', service.postRegister);

router.get('/login', service.getLogin);

router.post('/login', service.postLogin);

router.get('/logout', service.getLogout);

module.exports = router;
