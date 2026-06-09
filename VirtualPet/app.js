require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pet');

const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Połączono z MongoDB'))
  .catch(err => console.error('Błąd połączenia z MongoDB:', err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use('/auth', authRoutes);
app.use('/pet', petRoutes);

app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/pet');
  } else {
    res.redirect('/auth/login');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});