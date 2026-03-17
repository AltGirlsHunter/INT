const userModel = require('../models/user');
const { hashPassword, verifyPassword } = require('../config/hash');

async function register(req, res) {
    try {
        const { email, password, role, address } = req.body;

        const existing = await userModel.findUserByEmail(email);
        if (existing) return res.status(400).send('User already exists');

        const hashed = hashPassword(password);


        await userModel.createUser({
            email,
            password: hashed,
            role,
            address,
            createdAt: new Date()
        });

        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Registration error');
    }
}

function registerForm(req, res) {
    res.render('register');
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findUserByEmail(email);
        if (!user) return res.status(400).send('Invalid credentials');

        const valid = verifyPassword(password, user.password);
        if (!valid) return res.status(400).send('Invalid credentials');

        req.session.userId = user._id.toString();
        req.session.role = user.role;

        res.redirect('/products');
    } catch (err) {
        res.status(500).send('Login error');
    }
}
function loginForm(req, res) {
    res.render('login');
}

function logout(req, res) {
    req.session.destroy(() => {
        res.redirect('/login');
    });
}

module.exports = { register, login, logout,registerForm,loginForm };
