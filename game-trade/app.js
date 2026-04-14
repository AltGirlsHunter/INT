require('dotenv').config();
const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');

const { attachUser } = require('./middleware/auth');
const itemService = require('./services/itemService');
const userService = require('./services/userService');

const authRoutes = require('./routes/auth');
const itemsRoutes = require('./routes/items');
const transactionsRoutes = require('./routes/transactions');
const shopRoutes = require('./routes/shop');
const usersRoutes = require('./routes/users');

const app  = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));

app.use(session({
  secret:            process.env.SESSION_SECRET || 'fallback_secret_change_me',
  resave:            false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(attachUser);

app.use('/auth',         authRoutes);
app.use('/items',        itemsRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/shop',         shopRoutes);
app.use('/users',        usersRoutes);

// Home
app.get('/', function (req, res) {
  itemService.getListedItemsQuarry(function (err, recentListings) {
    var listings = err ? [] : recentListings.slice(0, 6);

    userService.getHomeStats(function (err, stats) {
      var defaultStats = { total_users: 0, total_transactions: 0, active_listings: 0, total_volume: 0 };
      res.render('home', {
        title:          'GameTrade - Platforma handlu przedmiotami',
        recentListings: listings,
        stats:          err ? defaultStats : stats,
        error:          req.query.error   || null,
        success:        req.query.success || null
      });
    });
  });
});

// 404
app.use(function (req, res) {
  res.status(404).render('error', { title: '404 - Nie znaleziono', message: 'Strona nie istnieje' });
});

// Start
app.listen(PORT, function () {
  console.log('Serwer działa na http://localhost:' + PORT);
  console.log('Baza danych: ' + (process.env.DB_NAME || 'game_trade') + ' @ ' + (process.env.DB_HOST || 'localhost'));
});

module.exports = app;
