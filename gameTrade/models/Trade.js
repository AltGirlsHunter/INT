const mongoose = require('mongoose');
const tradeSchema = new mongoose.Schema({
    senderEmail: String,
    receiverEmail: String,
    itemName: String,
    date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Trade', tradeSchema);