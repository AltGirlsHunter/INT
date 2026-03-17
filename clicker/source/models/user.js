const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

function createUser(user) {
    return getDB().collection('users').insertOne(user);
}

function findUserByEmail(email) {
    return getDB().collection('users').findOne({ email });
}

function findUserById(id) {
    return getDB().collection('users').findOne({ _id: new ObjectId(id) });
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};
