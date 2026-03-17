const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

function createProduct(product) {
    return getDB().collection('products').insertOne(product);
}

function getAllProducts(filter = {}, sort = {}) {
    return getDB()
        .collection('products')
        .find(filter)
        .sort(sort)
        .toArray();
}

function getProductById(id) {
    return getDB()
        .collection('products')
        .findOne({ _id: new ObjectId(id) });
}

function updateProduct(id, updateData) {
    return getDB()
        .collection('products')
        .updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
}

function deleteProduct(id, sellerId) {
    return getDB()
        .collection('products')
        .deleteOne({
            _id: new ObjectId(id),
            seller: sellerId
        });
}

function getProductsBySeller(sellerId) {
    return getDB()
        .collection('products')
        .find({ seller: sellerId })
        .toArray();
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsBySeller
};
