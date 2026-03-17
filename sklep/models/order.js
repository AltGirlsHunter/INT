const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

function createOrder(order) {
    return getDB().collection('orders').insertOne(order);
}

function getOrdersByClient(clientId) {
    return getDB()
        .collection('orders')
        .find({ client: clientId })
        .toArray();
}

function getOrdersForSeller(productIds) {
    return getDB()
        .collection('orders')
        .find({
            "products.product": { $in: productIds.map(id => new ObjectId(id)) }
        })
        .toArray();
}

module.exports = {
    createOrder,
    getOrdersByClient,
    getOrdersForSeller
};
