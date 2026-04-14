const db = require('../config/db');
const rollback = require('../middleware/rollback')

function buyFromUser(listingId, buyerId, callback) {
  db.getConnection(function (err, conn) {
    if (err) return callback(err);

    conn.beginTransaction(function (err) {
      if (err) { conn.release(); return callback(err); }

      conn.query(
        `SELECT ui.id, ui.user_id AS seller_id, ui.item_id, ui.price_listed,
                i.name, u.username AS seller_name
         FROM user_items ui
         JOIN items i ON ui.item_id = i.id
         JOIN users u ON ui.user_id = u.id
         WHERE ui.id = ? AND ui.is_listed = TRUE`,
        [listingId],
        function (err, listings) {
          if (err) return rollback.rollback(conn, err, callback);
          if (listings.length === 0) {
            return rollback.rollback(conn, { code: 'NOT_FOUND', message: 'Przedmiot niedostępny lub już sprzedany' }, callback);
          }

          const listing = listings[0];

          if (listing.seller_id === buyerId) {
            return rollback.rollback(conn, { code: 'OWN_ITEM', message: 'Nie możesz kupić własnego przedmiotu' }, callback);
          }

          conn.query(
            'SELECT balance FROM users WHERE id = ?',
            [buyerId],
            function (err, buyers) {
              if (err) return rollback.rollback(conn, err, callback);
              if (buyers[0].balance < listing.price_listed) {
                return rollback.rollback(conn, { code: 'NO_FUNDS', message: 'Niewystarczające środki' }, callback);
              }
              conn.query(
                'UPDATE users SET balance = balance - ? WHERE id = ?',
                [listing.price_listed, buyerId],
                function (err) {
                  if (err) return rollback.rollback(conn, err, callback);

                  conn.query(
                    'UPDATE users SET balance = balance + ? WHERE id = ?',
                    [listing.price_listed, listing.seller_id],
                    function (err) {
                      if (err) return rollback.rollback(conn, err, callback);

                      conn.query(
                        'UPDATE user_items SET user_id = ?, is_listed = FALSE, price_listed = NULL WHERE id = ?',
                        [buyerId, listingId],
                        function (err) {
                          if (err) return rollback.rollback(conn, err, callback);

                          conn.query(
                            'INSERT INTO transactions (seller_id, buyer_id, user_item_id, item_id, price, type) VALUES (?, ?, ?, ?, ?, ?)',
                            [listing.seller_id, buyerId, listingId, listing.item_id, listing.price_listed, 'trade'],
                            function (err) {
                              if (err) return rollback.rollback(conn, err, callback);

                              conn.commit(function (err) {
                                conn.release();
                                if (err) return callback(err);
                                callback(null, listing.name);
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


function getHistory(userId, callback) {
  db.query(
    `SELECT t.id, t.price, t.type, t.created_at,
            i.name AS item_name, i.rarity, i.game,
            seller.username AS seller_name,
            buyer.username  AS buyer_name,
            CASE WHEN t.buyer_id = ? THEN 'purchase' ELSE 'sale' END AS direction
     FROM transactions t
     JOIN items i        ON t.item_id   = i.id
     JOIN users seller   ON t.seller_id = seller.id
     JOIN users buyer    ON t.buyer_id  = buyer.id
     WHERE t.buyer_id = ? OR t.seller_id = ?
     ORDER BY t.created_at DESC
     LIMIT 50`,
    [userId, userId, userId],
    callback
  );
}


async function postTransaction(req, res) {
  buyFromUser(req.params.listingId, req.session.userId, function (err, itemName) {
    if (!err) {
      return res.redirect('/items/my?success=' + encodeURIComponent('Zakupiono: ' + itemName));
    }
    const known = ['NOT_FOUND', 'OWN_ITEM', 'NO_FUNDS'];
    if (known.indexOf(err.code) !== -1) {
      return res.redirect('/items?error=' + encodeURIComponent(err.message));
    }
    console.error(err);
    res.redirect('/items?error=Błąd podczas zakupu');
  });
}

async function getTransactionHistory(req, res) {
   getHistory(req.session.userId, function (err, transactions) {
    if (err) {
      console.error(err);
      return res.redirect('/?error=Błąd serwera');
    }
    res.render('transactions/history', {
      title:        'Historia transakcji',
      transactions,
      error:   req.query.error   || null,
      success: req.query.success || null
    });
  });
}



module.exports = { postTransaction, getTransactionHistory };
