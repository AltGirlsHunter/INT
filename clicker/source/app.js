require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { connectDB } = require('./config/db');
console.log(process.env.PORT)

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));


app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    if (req.session.userId) {
        req.user = { _id: req.session.userId };
    }
    next();
});


app.get('/', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/clicker');
    }
    res.redirect('/login');
});

app.use('/', require('./routes/authRoutes'));
app.use('/clicker', require('./routes/clickerRoutes'));


connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`http://localhost:${process.env.PORT}`);
    });
}).catch(err => {
    console.error("Failed to connect to the database: ", err);
    process.exit(1);
});

