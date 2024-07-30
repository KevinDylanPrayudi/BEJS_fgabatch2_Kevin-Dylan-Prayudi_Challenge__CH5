const router = require('express').Router();

const deposit = require('./deposit');
const withdraw = require('./witdraw');
const transfer = require('./transfer');

function main(db) {
    router.get('/deposits/:id', deposit(db).get);
    router.post('/deposit/', deposit(db).post);
    router.get('/deposit/:id', deposit(db).getOne);

    router.get('/withdraws/:id', withdraw(db).get);
    router.post('/withdraw/', withdraw(db).post);
    router.get('/withdraw/:id', withdraw(db).getOne);

    router.get('/transfers/sender/:id', transfer(db).sender);
    router.get('/transfers/recepient/:id', transfer(db).recepient);
    router.get('/transfer/:id', transfer(db).getOne);
    router.post('/transfer/', transfer(db).post);
    
    return router;
}

module.exports = main