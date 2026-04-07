const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
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
});

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
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
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/auth/login'));
});

module.exports = router;
