const router = require('express').Router();
const controller = require('../controllers/productController');

router.get('/', controller.listProducts);
router.get('/:id', controller.getProduct);

module.exports = router;
