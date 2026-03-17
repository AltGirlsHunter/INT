const productModel = require('../models/product');
const reviewModel = require('../models/review');

async function listProducts(req, res) {
    const { search, min, max, sort } = req.query;

    let filter = {};
    let sortObj = {};

    if (search) {
        filter.title = { $regex: search, $options: 'i' };
    }

    if (min && max) {
        filter.price = {
            $gte: Number(min),
            $lte: Number(max)
        };
    }

    if (sort === 'price_asc') sortObj.price = 1;
    if (sort === 'price_desc') sortObj.price = -1;

    const products = await productModel.getAllProducts(filter, sortObj);

    res.render('products', { products });
}

async function getProduct(req, res) {
    const product = await productModel.getProductById(req.params.id);
    const reviews = await reviewModel.getReviewsByProduct(req.params.id);

    res.render('productDetails', { product, reviews });
}

module.exports = { listProducts, getProduct };