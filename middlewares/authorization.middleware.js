const db = require('../db');

function isAdmin(req, res, next) {
    if (!req.user || req.user.identity_type_name.toLowerCase() !== 'admin') {
        return res.status(401).json({
            status: 'fail',
            message: 'unauthorized'
        });
    } else {
        next();
    }
}

function authorization() {
    function user(req, res, next) {
        if (req.user.identity_type_name.toLowerCase() == "admin") return next();

        if (req.user.id == req.params.id) return next();

        return res.status(401).json({
            status: 'fail',
            message: 'unauthorized'
        });
    }

    async function account(req, res, next) {
        if (req.user.identity_type_name.toLowerCase() == "admin") return next();
        const id = await db.accounts.findUnique({
            where: {
                id: req.params.id,
                user_id: req.user.id
            },
            select: {
                user_id: true
            }
        })
        if (id) return next();
        return res.status(401).json({
            status: 'fail',
            message: 'unauthorized'
        });
    }

    async function profile(req, res, next) {
        if (req.user.identity_type_name.toLowerCase() == "admin") return next();
        const id = await db.profiles.findUnique({
            where: {
                id: req.params.id,
                user_id: req.user.id
            },
            select: {
                user_id: true
            }
        })
        if (id) return next();
        return res.status(401).json({
            status: 'fail',
            message: 'unauthorized'
        });
    }

    return {
        user,
        account,
        profile
    };
}

module.exports = {
    isAdmin,
    authorization
};
