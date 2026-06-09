require('dotenv').config();
const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

app.use('/auth', require('./routes/auth'));
app.use('/shop', require('./routes/shop'));
app.use('/trade', require('./routes/trade'));

app.get('/', (req, res) => res.redirect('/auth/login'));
app.listen(3000, () => console.log("Serwer: http://localhost:3000"));