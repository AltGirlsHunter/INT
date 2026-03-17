const productModel = require('../models/product');
const orderModel = require('../models/order');
const reviewModel = require('../models/review');
const { ObjectId } = require('mongodb');

async function createProduct(req, res) {
    try {
        await productModel.createProduct({
            title: req.body.title,
            description: req.body.description,
            price: Number(req.body.price),
            seller: new ObjectId(req.session.userId),
            createdAt: new Date(),
            ratings: [],
            likes: []
        });

        res.redirect('/seller/products');
    } catch (err) {
        res.status(500).send('Create product error');
    }
}

async function myProducts(req, res) {
    try {
        const products = await productModel.getProductsBySeller(
            new ObjectId(req.session.userId)
        );

        res.render('sellerProducts', { products });
    } catch (err) {
        res.status(500).send('Error loading products');
    }
}

async function deleteProduct(req, res) {
    try {
        await productModel.deleteProduct(
            req.params.id,
            new ObjectId(req.session.userId)
        );

        res.redirect('/seller/products');
    } catch (err) {
        res.status(500).send('Delete error');
    }
}

async function myOrders(req, res) {
    try {
        const products = await productModel.getProductsBySeller(
            new ObjectId(req.session.userId)
        );

        const productIds = products.map(p => p._id);

        const orders = await orderModel.getOrdersForSeller(productIds);

        res.render('sellerOrders', { orders });
    } catch (err) {
        res.status(500).send('Order load error');
    }
}

async function viewReviews(req, res) {
    try {
        const products = await productModel.getProductsBySeller(
            new ObjectId(req.session.userId)
        );

        const productIds = products.map(p => p._id);

        const reviews = await reviewModel.getReviewsForSeller(productIds);

        res.render('sellerReviews', { reviews });
    } catch (err) {
        res.status(500).send('Review load error');
    }
}

module.exports = {
    createProduct,
    myProducts,
    deleteProduct,
    myOrders,
    viewReviews
};
