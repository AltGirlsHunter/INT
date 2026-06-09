const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Połączono z bazą danych Darknet.");
    } catch (err) {
        console.error(err);
    }
};

module.exports = connectDB;