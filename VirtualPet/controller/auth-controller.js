const User = require('../models/User');

module.exports.registerForm = async (req, res) => {
    res.render('register');
}

module.exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.redirect('/auth/login');
    } catch (error) {
        res.render('register', { error: 'Nazwa użytkownika jest już zajęta' });
    }
}

module.exports.loginForm = async (req, res) => {
    res.render('login');
}

module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && await user.comparePassword(password)) {
            req.session.userId = user._id;
            return res.redirect('/pet');
        }
        res.render('login', { error: 'Nieprawidłowa nazwa użytkownika lub hasło' });
    } catch (error) { 
        res.render('login', { error: 'Nieprawidłowa nazwa użytkownika lub hasło.' });
        console.error(error)
    }
}

module.exports.logout = async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
}