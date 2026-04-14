const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, userService.getUsers);

router.get('/:id', requireAuth, userService.getUserById);

module.exports = router;
