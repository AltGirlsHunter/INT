const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getRegister = (req, res) => res.render('register');

exports.postRegister = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
        res.redirect('/login');
    } catch (err) {
        res.send("Błąd: Użytkownik prawdopodobnie już istnieje.");
    }
};

exports.getLogin = (req, res) => res.render('login');

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.isLoggedIn = true;
        res.redirect('/');
    } else {
        res.send("Błędne dane logowania.");
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};

exports.getIndex = (req, res) => res.render('index');

exports.getLevel1 = (req, res) => res.render('levels/level1');

exports.getLevel2 = (req, res) => {
    res.set('X-Next-Step', 'Uzyj parametru /secure/data-transfer?debug=true');
    res.render('levels/level2');
};

exports.getLevel3 = (req, res) => {
    if (req.query.debug === 'true') {
        req.session.level3_complete = true;
        return res.render('levels/level3');
    }
    res.status(403).send("Błąd: Brak flagi debugowania (?debug=true)");
};

exports.getLevel4 = (req, res) => {
    if (req.session.level3_complete) {
        return res.render('levels/level4');
    }
    res.status(401).send("Błąd: Nie masz uprawnień. Najpierw ukończ poziom 3!");
};

exports.getLevel5 = (req, res) => res.render('levels/level5');

exports.getFinal = (req, res) => res.render('final');