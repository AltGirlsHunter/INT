const express = require('express');
const router = express.Router();
const shopService = require('../services/shopService');
const { requireAuth } = require('../middleware/auth');

router.get('/', shopService.getItems);

router.post('/buy/:shopItemId', requireAuth, shopService.postBuyItem);

module.exports = router;
