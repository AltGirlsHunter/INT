const router = require('express').Router();
const controller = require('../controllers/sellerController');
const requireLogin = require('../middleware/requireLogin');
const requireRole = require('../middleware/requireRole');

router.get('/products',
    requireLogin,
    requireRole('seller'),
    controller.myProducts
);

router.post('/products',
    requireLogin,
    requireRole('seller'),
    controller.createProduct
);

router.post('/products/delete/:id',
    requireLogin,
    requireRole('seller'),
    controller.deleteProduct
);

router.get('/orders',
    requireLogin,
    requireRole('seller'),
    controller.myOrders
);

router.get('/reviews',
    requireLogin,
    requireRole('seller'),
    controller.viewReviews
);

module.exports = router;
