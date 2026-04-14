const db = require('../config/db');
const rollback = require('../middleware/rollback')

function getShopItems(callback) {
  db.query(
    `SELECT si.id AS shop_item_id, si.price, si.stock, si.is_available,
            i.id AS item_id, i.name, i.description, i.game, i.rarity, i.image_url
     FROM shop_items si
     JOIN items i ON si.item_id = i.id
     WHERE si.is_available = TRUE
     ORDER BY i.rarity DESC`,
    callback
  );
}


function buyFromShop(shopItemId, buyerId, callback) {
  db.getConnection(function (err, conn) {
    if (err) return callback(err);

    conn.beginTransaction(function (err) {
      if (err) { conn.release(); return callback(err); }

      conn.query(
        `SELECT si.id, si.item_id, si.price, si.stock, i.name
         FROM shop_items si
         JOIN items i ON si.item_id = i.id
         WHERE si.id = ? AND si.is_available = TRUE`,
        [shopItemId],
        function (err, shopRows) {
          if (err) return rollback(conn, err, callback);
          if (shopRows.length === 0) {
            return rollback.rollback(conn, { code: 'NOT_FOUND', message: 'Przedmiot niedostępny' }, callback);
          }

          const shopItem = shopRows[0];

          if (shopItem.stock === 0) {
            return rollback.rollback(conn, { code: 'NO_STOCK', message: 'Brak towaru w magazynie' }, callback);
          }

          conn.query(
            'SELECT balance FROM users WHERE id = ?',
            [buyerId],
            function (err, buyers) {
              if (err) return rollback(conn, err, callback);
              if (buyers[0].balance < shopItem.price) {
                return rollback.rollback(conn, { code: 'NO_FUNDS', message: 'Niewystarczające środki' }, callback);
              }

              conn.query(
                'UPDATE users SET balance = balance - ? WHERE id = ?',
                [shopItem.price, buyerId],
                function (err) {
                  if (err) return rollback.rollback(conn, err, callback);

                  conn.query(
                    'INSERT INTO user_items (user_id, item_id, is_listed) VALUES (?, ?, FALSE)',
                    [buyerId, shopItem.item_id],
                    function (err, result) {
                      if (err) return rollback.rollback(conn, err, callback);

                      const newUserItemId = result.insertId;

                      conn.query(
                        `UPDATE shop_items
                         SET stock        = IF(stock > 0, stock - 1, stock),
                             is_available = IF(stock > 0 AND stock - 1 = 0, FALSE, is_available)
                         WHERE id = ?`,
                        [shopItemId],
                        function (err) {
                          if (err) return rollback.rollback(conn, err, callback);

                          conn.query(
                            'INSERT INTO transactions (seller_id, buyer_id, user_item_id, item_id, price, type) VALUES (?, ?, ?, ?, ?, ?)',
                            [buyerId, buyerId, newUserItemId, shopItem.item_id, shopItem.price, 'shop'],
                            function (err) {
                              if (err) return rollback.rollback(conn, err, callback);

                              conn.commit(function (err) {
                                conn.release();
                                if (err) return callback(err);
                                callback(null, shopItem.name);
                              });
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
}


async function getItems(req, res) {
  getShopItems(function (err, shopItems) {
    if (err) {
      console.error(err);
      return res.render('shop/index', {
        title: 'Sklep', shopItems: [], error: 'Błąd serwera', success: null
      });
    }
    res.render('shop/index', {
      title:     'Sklep',
      shopItems,
      error:   req.query.error   || null,
      success: req.query.success || null
    });
  });
}


async function postBuyItem(req, res) {
   buyFromShop(req.params.shopItemId, req.session.userId, function (err, itemName) {
    if (!err) {
      return res.redirect('/items/my?success=' + encodeURIComponent('Zakupiono ze sklepu: ' + itemName));
    }
    const known = ['NOT_FOUND', 'NO_STOCK', 'NO_FUNDS'];
    if (known.indexOf(err.code) !== -1) {
      return res.redirect('/shop?error=' + encodeURIComponent(err.message));
    }
    console.error(err);
    res.redirect('/shop?error=Błąd podczas zakupu');
  });
}
module.exports = { getItems, postBuyItem };
