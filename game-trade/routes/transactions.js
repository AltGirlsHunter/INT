const express = require('express');
const router = express.Router();
const transactionService = require('../services/transactionService');
const { requireAuth } = require('../middleware/auth');

router.post('/buy/:listingId', requireAuth, transactionService.postTransaction);

router.get('/history', requireAuth, transactionService.getTransactionHistory);

module.exports = router;
