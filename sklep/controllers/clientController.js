const orderModel = require('../models/order');
const reviewModel = require('../models/review');
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

function addToCart(req, res) {
    if (!req.session.cart) req.session.cart = [];

    req.session.cart.push({
        product: req.params.id,
        quantity: 1
    });

    res.redirect('/products');
}

function removeFromCart(req, res) {
    if (!req.session.cart) return res.redirect('/products');

    req.session.cart = req.session.cart.filter(
        p => p.product !== req.params.id
    );

    res.redirect('/products');
}

async function placeOrder(req, res) {
    try {
        if (!req.session.cart || req.session.cart.length === 0)
            return res.redirect('/products');

        const products = req.session.cart.map(p => ({
            product: new ObjectId(p.product),
            quantity: p.quantity
        }));

        await orderModel.createOrder({
            products,
            client: new ObjectId(req.session.userId),
            createdAt: new Date()
        });

        req.session.cart = [];

        res.redirect('/products');
    } catch (err) {
        res.status(500).send('Order error');
    }
}

async function addReview(req, res) {
    try {
        await reviewModel.createReview({
            product: new ObjectId(req.params.productId),
            client: new ObjectId(req.session.userId),
            content: req.body.content,
            value: Number(req.body.value),
            createdAt: new Date()
        });
        res.redirect('/products/' + req.params.productId);
    } catch (err) {
        res.status(500).send('Review error');
    }
}


async function rateProduct(req, res) {
    try {
        const db = getDB();

        await db.collection('products').updateOne(
            { _id: new ObjectId(req.params.productId) },
            {
                $push: {
                    ratings: {
                        user: new ObjectId(req.session.userId),
                        value: Number(req.body.value)
                    }
                }
            }
        );

        res.redirect('/products/' + req.params.productId);
    } catch (err) {
        res.status(500).send('Rating error');
    }
}
function viewCart(req, res) {
    const cart = req.session.cart || [];
    res.render('cart', { cart, role: req.session.role });
}

module.exports = {
    addToCart,
    removeFromCart,
    placeOrder,
    addReview,
    rateProduct,
    viewCart
};
