function requireRole(role) {
    return function (req, res, next) {
        if (!req.session || !req.session.userId) {
            return res.redirect('/login');
        }

        if (req.session.role !== role) {
            return res.status(403).send('Brak dostępu');
        }

        next();
    };
}

module.exports = requireRole;
