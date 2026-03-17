const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

function createReview(review) {
    return getDB().collection('reviews').insertOne(review);
}

function getReviewsByProduct(productId) {
    return getDB()
        .collection('reviews')
        .find({ product: new ObjectId(productId) })
        .toArray();
}

module.exports = {
    createReview,
    getReviewsByProduct
};
