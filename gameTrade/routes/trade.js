const express = require('express');
const router = express.Router();
const tradeCtrl = require('../controllers/tradeController');
const isAuth = require('../middleware/auth');

router.get('/history', isAuth, tradeCtrl.getHistory);
router.post('/send', isAuth, tradeCtrl.sendItem);

module.exports = router;