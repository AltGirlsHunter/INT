const db = require('../config/db');

function getAllUsers(callback) {
  db.query(
    'SELECT id, username, balance, created_at FROM users ORDER BY username',
    callback
  );
}


function getUserById(userId, callback) {
  db.query(
    'SELECT id, username, balance, created_at FROM users WHERE id = ?',
    [userId],
    function (err, rows) {
      if (err) return callback(err);
      callback(null, rows.length > 0 ? rows[0] : null);
    }
  );
}


function getUserItemsForProfile(userId, callback) {
  db.query(
    `SELECT ui.id AS listing_id, i.name, i.description, i.game, i.rarity, i.image_url,
            ui.price_listed, ui.is_listed
     FROM user_items ui
     JOIN items i ON ui.item_id = i.id
     WHERE ui.user_id = ?
     ORDER BY ui.acquired_at DESC`,
    [userId],
    callback
  );
}


function getHomeStats(callback) {
  db.query(
    `SELECT
       (SELECT COUNT(*) FROM users) AS total_users,
       (SELECT COUNT(*) FROM transactions) AS total_transactions,
       (SELECT COUNT(*) FROM user_items WHERE is_listed = TRUE) AS active_listings,
       (SELECT IFNULL(SUM(price), 0) FROM transactions) AS total_volume`,
    function (err, rows) {
      if (err) return callback(err);
      callback(null, rows[0]);
    }
  );
}


async function getUsers(req, res) {
   getAllUsers(function (err, users) {
    if (err) {
      console.error(err);
      return res.redirect('/?error=Błąd serwera');
    }
    res.render('users/index', {
      title:   'Użytkownicy',
      users,
      error:   req.query.error   || null,
      success: req.query.success || null
    });
  });
}

async function getUserById(req, res) {
  userService.getUserById(req.params.id, function (err, profile) {
    if (err) {
      console.error(err);
      return res.redirect('/users?error=Błąd serwera');
    }
    if (!profile) {
      return res.redirect('/users?error=Użytkownik nie istnieje');
    }

    userService.getUserItemsForProfile(req.params.id, function (err, items) {
      if (err) {
        console.error(err);
        return res.redirect('/users?error=Błąd serwera');
      }
      res.render('users/profile', {
        title:   profile.username,
        profile,
        items,
        error:   req.query.error   || null,
        success: req.query.success || null
      });
    });
  });
}

module.exports = { getUsers, getUserById, getHomeStats, getUserItemsForProfile };
