const User = require('../models/User');

async function postRegister(req, res) {
      const { username, password } = req.body;
      try {
        const exists = await User.findOne({ username });
        if (exists) return res.render('register', { error: 'Nazwa użytkownika już istnieje.' });
    
        const user = await User.create({ username, password });
        req.session.userId = user._id;
        res.redirect('/pet');
      } catch (err) {
        console.error(err);
        res.render('register', { error: 'Błąd rejestracji.' });
      }
}

async function getRegister(req, res) {
      res.render('register', { error: null });
}

async function getLogin(req, res) {
      res.render('login', { error: null });
}

async function postLogin(req, res) {
    const { username, password } = req.body;
      try {
        const user = await User.findOne({ username });
        if (!user) return res.render('login', { error: 'Nieprawidłowe dane logowania.' });
    
        const match = await user.comparePassword(password);
        if (!match) return res.render('login', { error: 'Nieprawidłowe dane logowania.' });
    
        req.session.userId = user._id;
        res.redirect('/pet');
      } catch (err) {
        console.error(err);
        res.render('login', { error: 'Błąd logowania.' });
      }
}

async function getLogout(req, res) {
     req.session.destroy(() => res.redirect('/auth/login'));
}

module.exports = {getLogin, postLogin, getRegister, postRegister, getLogout}