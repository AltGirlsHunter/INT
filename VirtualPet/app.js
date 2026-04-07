require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const petRoutes  = require('./routes/pet');

const app  = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Połączono z MongoDB'))
  .catch(err => { console.error('Błąd MongoDB:', err); process.exit(1); });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'tajny_klucz',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } 
}));

app.use('/auth', authRoutes);
app.use('/pet',  petRoutes);

app.get('/', (req, res) => {
  if (req.session && req.session.userId) return res.redirect('/pet');
  res.redirect('/auth/login');
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
