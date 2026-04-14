const crypto = require('../middleware/crypto');
const db = require('../config/db');



function register(username, email, password, passwordConfirm, callback) {
  if (!username || !email || !password) {
    return callback({ code: 'VALIDATION', message: 'Wszystkie pola są wymagane' });
  }
  if (password !== passwordConfirm) {
    return callback({ code: 'VALIDATION', message: 'Hasła nie są zgodne' });
  }
  if (password.length < 6) {
    return callback({ code: 'VALIDATION', message: 'Hasło musi mieć minimum 6 znaków' });
  }

  const passwordHash = crypto.hashPassword(password);
  db.query(
    'INSERT INTO users (username, email, password_hash, balance) VALUES (?, ?, ?, 1000.00)',
    [username, email, passwordHash],
    function (err) {
      callback(err || null);
    }
  );
}

function login(email, password, callback) {
  if (!email || !password) {
    return callback({ code: 'VALIDATION', message: 'Wypełnij wszystkie pola' });
  }

  const passwordHash = crypto.hashPassword(password);
  db.query(
    'SELECT id, username, email, balance FROM users WHERE email = ? AND password_hash = ?',
    [email, passwordHash],
    function (err, rows) {
      if (err) return callback(err);
      callback(null, rows.length > 0 ? rows[0] : null);
    }
  );
}



async function getRegister(req, res) {
   if (req.session.userId) return res.redirect('/');
  res.render('auth/register', {
    title: 'Rejestracja',
    error: req.query.error || null,
    success: req.query.success || null
  });
}


async function postRegister(req, res) {
   const { username, email, password, password_confirm } = req.body;

  register(username, email, password, password_confirm, function (err) {
    if (!err) {
      return res.redirect('/auth/login?success=Konto utworzone! Możesz się zalogować');
    }
    if (err.code === 'VALIDATION') {
      return res.redirect('/auth/register?error=' + encodeURIComponent(err.message));
    }
    if (err.code === 'ER_DUP_ENTRY') {
      return res.redirect('/auth/register?error=Nazwa użytkownika lub email już istnieje');
    }
    console.error(err);
    res.redirect('/auth/register?error=Błąd serwera');
  });
}



async function getLogin(req, res) {
  if (req.session.userId) return res.redirect('/');
  res.render('auth/login', {
    title: 'Logowanie',
    error: req.query.error || null,
    success: req.query.success || null
  });
}



async function postLogin(req, res) {
    const { email, password } = req.body;

  login(email, password, function (err, user) {
    if (err && err.code === 'VALIDATION') {
      return res.redirect('/auth/login?error=' + encodeURIComponent(err.message));
    }
    if (err) {
      console.error(err);
      return res.redirect('/auth/login?error=Błąd serwera');
    }
    if (!user) {
      return res.redirect('/auth/login?error=Nieprawidłowy email lub hasło');
    }
    req.session.userId   = user.id;
    req.session.username = user.username;
    res.redirect('/');
  });
}



async function getLogout(req, res) {
    req.session.destroy(function () {
    res.redirect('/auth/login');
  });
}


module.exports = { getRegister, postRegister, getLogin, postLogin, getLogout };
