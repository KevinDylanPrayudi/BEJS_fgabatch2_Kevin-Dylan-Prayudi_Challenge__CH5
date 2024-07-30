const api = require('./api');

function main(router, db) {
    router.use('/api', api(db));
    return router;
}

module.exports = main;