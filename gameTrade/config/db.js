const mongoose = require('mongoose');
const Item = require('../models/Item');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Połączono z MongoDB Compass!");

        const count = await Item.countDocuments();
        if (count === 0) {
            await Item.insertMany([
                { name: "Legendarny Miecz", price: 250 },
                { name: "Tarcza Prawdy", price: 150 },
                { name: "Magiczny Pierścień", price: 500 }
            ]);
            console.log("Dodano przedmioty startowe.");
        }
    } catch (err) {
        console.error(err);
    }
};
module.exports = connectDB;