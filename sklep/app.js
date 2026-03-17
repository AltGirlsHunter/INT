
const express = require('express');
const session = require('express-session');
const path = require('path');
const { connectDB } = require('./config/db');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "sekretGWen",
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.userId = req.session.userId;
    res.locals.role = req.session.role;
    next();
});


app.get('/', (req, res) => {
    res.redirect('/products');
});

app.use('/products', require('./routes/productRoutes'));
app.use('/client', require('./routes/clientRoutes'));
app.use('/seller', require('./routes/sellerRoutes'));
app.use('/', require('./routes/authRoutes'));

const PORT = 3000

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Failed to connect to the database: ", err);
    process.exit(1);
});
