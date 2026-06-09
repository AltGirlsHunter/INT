const User = require('../models/User');
const Trade = require('../models/Trade');

exports.sendItem = async (req, res) => {
    try {
        const { receiverEmail, itemId } = req.body;
        const sender = await User.findById(req.session.userId);
        const receiver = await User.findOne({ email: receiverEmail });

        if (!receiver) return res.send("Nie znaleziono użytkownika o takim adresie e-mail!");
        if (sender.email === receiverEmail) return res.send("Nie możesz wysłać przedmiotu do samego siebie!");

        const itemIdx = sender.inventory.findIndex(i => i.instanceId === itemId);

        if (itemIdx > -1) {
            const itemToTransfer = sender.inventory[itemIdx];

            sender.inventory.splice(itemIdx, 1);
            sender.markModified('inventory');
            await sender.save();

            receiver.inventory.push(itemToTransfer);
            receiver.markModified('inventory');
            await receiver.save();

            await Trade.create({
                senderEmail: sender.email,
                receiverEmail: receiver.email,
                itemName: itemToTransfer.name
            });

            res.redirect('/trade/history');
        } else {
            res.send("Błąd: Nie posiadasz tego przedmiotu w ekwipunku!");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Wystąpił błąd podczas handlu.");
    }
};

exports.getHistory = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const history = await Trade.find({
            $or: [{ senderEmail: user.email }, { receiverEmail: user.email }]
        }).sort({ date: -1 });
        
        res.render('trade/history', { history, myEmail: user.email });
    } catch (err) {
        res.status(500).send("Błąd ładowania historii.");
    }
};