const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/auth');
const controller = require('../controller/pet-controller');

router.get('/', requireAuth, controller.getPet);

router.get('/create', requireAuth, controller.createPetForm);

router.post('/create', requireAuth, controller.createPet);

router.post('/feed', requireAuth, controller.feedPet);

router.post('/play', requireAuth, controller.playPet);

router.post('/sleep', requireAuth, controller.sleepPet);

module.exports = router;