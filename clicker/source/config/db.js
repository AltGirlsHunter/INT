require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const dbName = "clicker";


const client = new MongoClient(uri);

let db;

async function connectDB() {
    await client.connect();            
    db = client.db(dbName);         
}

function getDB(){
    return db;
}

module.exports = { connectDB, getDB };
