const router = require('express').Router();
const controller = require('../controllers/authController');

router.get('/login', controller.loginForm);
router.get('/register', controller.registerForm);

router.post('/login', controller.login);
router.post('/register', controller.register);

router.get('/logout', controller.logout);

module.exports = router;
