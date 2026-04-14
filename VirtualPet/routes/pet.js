const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const service = require('../services/petServices')

router.get('/', requireAuth, service.render);

router.post('/create', requireAuth, service.createPet);

router.post('/feed', requireAuth, service.feedPet);

router.post('/play', requireAuth, service.playWithPet);


router.post('/sleep', requireAuth, service.makePetSleep);

module.exports = router;
