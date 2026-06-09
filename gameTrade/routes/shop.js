const express = require('express');
const router = express.Router();
const shopCtrl = require('../controllers/shopController');
const isAuth = require('../middleware/auth');

router.get('/', isAuth, shopCtrl.getShop);
router.get('/inventory', isAuth, shopCtrl.getInventory);
router.post('/buy/:id', isAuth, shopCtrl.buyItem);
router.post('/sell/:id', isAuth, shopCtrl.sellItem);

module.exports = router;