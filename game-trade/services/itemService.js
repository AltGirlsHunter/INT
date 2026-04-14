const db = require('../config/db');


function getListedItemsQuarry(callback) {
  db.query(
    `SELECT ui.id AS listing_id, i.name, i.description, i.game, i.rarity, i.image_url,
            ui.price_listed AS price, u.username AS seller
     FROM user_items ui
     JOIN items i ON ui.item_id = i.id
     JOIN users u ON ui.user_id = u.id
     WHERE ui.is_listed = TRUE
     ORDER BY ui.acquired_at DESC`,
    callback
  );
}


function getAllItemsQuarry(callback) {
  db.query('SELECT * FROM items ORDER BY rarity DESC', callback);
}


function getUserItemsQuarry(userId, callback) {
  db.query(
    `SELECT ui.id AS listing_id, i.name, i.description, i.game, i.rarity, i.image_url,
            ui.price_listed, ui.is_listed, ui.acquired_at
     FROM user_items ui
     JOIN items i ON ui.item_id = i.id
     WHERE ui.user_id = ?
     ORDER BY ui.acquired_at DESC`,
    [userId],
    callback
  );
}


function listItemQuarry(listingId, userId, price, callback) {
  const parsed = parseFloat(price);
  if (!price || isNaN(parsed) || parsed <= 0) {
    return callback({ code: 'VALIDATION', message: 'Podaj prawidłową cenę' });
  }

  db.query(
    'SELECT id FROM user_items WHERE id = ? AND user_id = ?',
    [listingId, userId],
    function (err, rows) {
      if (err) return callback(err);
      if (rows.length === 0) {
        return callback({ code: 'NOT_OWNER', message: 'Nie masz takiego przedmiotu' });
      }
      db.query(
        'UPDATE user_items SET is_listed = TRUE, price_listed = ? WHERE id = ?',
        [parsed, listingId],
        function (err) { callback(err || null); }
      );
    }
  );
}


function unlistItemQuarry(listingId, userId, callback) {
  db.query(
    'SELECT id FROM user_items WHERE id = ? AND user_id = ?',
    [listingId, userId],
    function (err, rows) {
      if (err) return callback(err);
      if (rows.length === 0) {
        return callback({ code: 'NOT_OWNER', message: 'Nie masz takiego przedmiotu' });
      }
      db.query(
        'UPDATE user_items SET is_listed = FALSE, price_listed = NULL WHERE id = ?',
        [listingId],
        function (err) { callback(err || null); }
      );
    }
  );
}


async function getAllItems(req, res) {
   getListedItemsQuarry(function (err, items) {
    if (err) {
      console.error(err);
      return res.render('items/index', {
        title: 'Rynek', items: [], allItems: [], error: 'Błąd serwera', success: null
      });
    }
    getAllItemsQuarry(function (err, allItems) {
      res.render('items/index', {
        title: 'Rynek',
        items,
        allItems: err ? [] : allItems,
        error:   req.query.error   || null,
        success: req.query.success || null
      });
    });
  });
}

async function getMyItems(req, res) {
    getUserItemsQuarry(req.session.userId, function (err, myItems) {
    if (err) {
      console.error(err);
      return res.redirect('/?error=Błąd serwera');
    }
    res.render('items/my', {
      title:   'Moje przedmioty',
      myItems,
      error:   req.query.error   || null,
      success: req.query.success || null
    });
  });
}

async function postListing(req, res) {
  listItemQuarry(req.params.listingId, req.session.userId, req.body.price, function (err) {
    if (!err) return res.redirect('/items/my?success=Przedmiot wystawiony na sprzedaż');
    if (err.code === 'VALIDATION' || err.code === 'NOT_OWNER') {
      return res.redirect('/items/my?error=' + encodeURIComponent(err.message));
    }
    console.error(err);
    res.redirect('/items/my?error=Błąd serwera');
  });
}

async function postUnlist(req, res) {
   unlistItemQuarry(req.params.listingId, req.session.userId, function (err) {
    if (!err) return res.redirect('/items/my?success=Oferta wycofana');
    if (err.code === 'NOT_OWNER') {
      return res.redirect('/items/my?error=' + encodeURIComponent(err.message));
    }
    console.error(err);
    res.redirect('/items/my?error=Błąd serwera');
  });
}



module.exports = { getAllItems, getMyItems, postListing, postUnlist, getListedItemsQuarry};
