const express = require('express');
const router = express.Router();
const gameCtrl = require('../controllers/gameController');

const isAuth = (req, res, next) => {
    if (req.session.isLoggedIn) return next();
    res.redirect('/register');
};

router.get('/register', gameCtrl.getRegister);
router.post('/register', gameCtrl.postRegister);
router.get('/login', gameCtrl.getLogin);
router.post('/login', gameCtrl.postLogin);
router.get('/logout', gameCtrl.logout);

router.get('/', isAuth, gameCtrl.getIndex);
router.get('/level-1', isAuth, gameCtrl.getLevel1);
router.get('/v1/api/terminal', isAuth, gameCtrl.getLevel2);
router.get('/secure/data-transfer', isAuth, gameCtrl.getLevel3);
router.get('/internal/system-logs', isAuth, gameCtrl.getLevel4);
router.get('/deep-web/core', isAuth, gameCtrl.getLevel5);
router.get('/final-message', isAuth, gameCtrl.getFinal);

module.exports = router;