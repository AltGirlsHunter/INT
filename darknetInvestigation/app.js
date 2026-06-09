require('dotenv').config();

const express    = require('express');
const session    = require('express-session');
const connectDB  = require('./config/db');
const gameRoutes = require('./routes/game');

const app = express();

connectDB();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_zmien_mnie',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/', gameRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[SERVER] Serwer działa na http://localhost:${PORT}`);
});
