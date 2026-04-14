const express = require('express');
const router = express.Router();
const itemService = require('../services/itemService');
const { requireAuth } = require('../middleware/auth');

router.get('/', itemService.getAllItems);

router.get('/my', requireAuth, itemService.getMyItems);

router.post('/:listingId/list', requireAuth, itemService.postListing);

router.post('/:listingId/unlist', requireAuth, itemService.postUnlist);

module.exports = router;
