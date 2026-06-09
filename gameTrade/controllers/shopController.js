const User = require('../models/User');
const Item = require('../models/Item');

exports.getShop = async (req, res) => {
    try {
        const items = await Item.find();
        const user = await User.findById(req.session.userId);
        res.render('shop/index', { items, user });
    } catch (err) {
        res.status(500).send("Błąd sklepu");
    }
};

exports.buyItem = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const item = await Item.findById(req.params.id);

        if (item && user.balance >= item.price) {
            user.balance -= item.price;
            
            user.inventory.push({
                instanceId: Date.now() + Math.random().toString(36).substr(2, 9), 
                name: item.name,
                price: item.price
            });

            await user.save();
            await Item.findByIdAndDelete(req.params.id);
            res.redirect('/shop/inventory');
        } else {
            res.send("Brak środków lub przedmiot wykupiony");
        }
    } catch (err) {
        res.status(500).send("Błąd zakupu");
    }
};

exports.getInventory = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        res.render('shop/inventory', { user });
    } catch (err) {
        res.status(500).send("Błąd ładowania ekwipunku");
    }
};

exports.sellItem = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const instId = req.params.id;

        const itemIdx = user.inventory.findIndex(i => i.instanceId === instId);

        if (itemIdx > -1) {
            const item = user.inventory[itemIdx];
            user.balance += item.price;
            
            await Item.create({ name: item.name, price: item.price });
            
            user.inventory.splice(itemIdx, 1);
            
            user.markModified('inventory');
            await user.save();
            
            res.redirect('/shop/inventory');
        } else {
            res.send("Nie masz tego przedmiotu");
        }
    } catch (err) {
        res.status(500).send("Błąd sprzedaży");
    }
};