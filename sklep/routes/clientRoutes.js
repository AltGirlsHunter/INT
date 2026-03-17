const router = require('express').Router();
const controller = require('../controllers/clientController');
const requireLogin = require('../middleware/requireLogin');
const requireRole = require('../middleware/requireRole');

router.post('/cart/add/:id',
    requireLogin,
    requireRole('client'),
    controller.addToCart
);

router.post('/cart/remove/:id',
    requireLogin,
    requireRole('client'),
    controller.removeFromCart
);

router.post('/order',
    requireLogin,
    requireRole('client'),
    controller.placeOrder
);

router.post('/review/:productId',
    requireLogin,
    requireRole('client'),
    controller.addReview
);

router.post('/rate/:productId',
    requireLogin,
    requireRole('client'),
    controller.rateProduct
);
router.get('/cart',
    requireLogin,
    requireRole('client'),
    controller.viewCart
);

module.exports = router;
