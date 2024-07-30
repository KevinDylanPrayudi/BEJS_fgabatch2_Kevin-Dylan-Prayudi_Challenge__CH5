const router = require('express').Router();

function main(db) {
    router.use('/v1', require('./v1')(db))
    
    return router;
}

module.exports = main