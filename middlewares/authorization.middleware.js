function authorization(req, res, next) {
    if (!req.user || req.user.identity_type_name.toLowerCase() !== 'admin') {
        return res.status(401).json({
            status: 'fail',
            message: 'unauthorized'
        });
    } else {
        next();
    }
}

module.exports = authorization;
