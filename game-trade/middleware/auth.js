const db = require('../config/db');

// Middleware: sprawdza czy użytkownik jest zalogowany
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect('/auth/login?error=Musisz być zalogowany');
  }
  next();
}

// Middleware: dołącza dane zalogowanego użytkownika do res.locals
function attachUser(req, res, next) {
  if (!req.session || !req.session.userId) {
    res.locals.user = null;
    return next();
  }

  db.query(
    'SELECT id, username, email, balance FROM users WHERE id = ?',
    [req.session.userId],
    function (err, rows) {
      if (err || rows.length === 0) {
        res.locals.user = null;
      } else {
        res.locals.user = rows[0];
        req.user = rows[0];
      }
      next();
    }
  );
}

module.exports = { requireAuth, attachUser };
