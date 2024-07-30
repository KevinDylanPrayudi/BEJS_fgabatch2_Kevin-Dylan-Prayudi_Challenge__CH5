const router = require('express').Router();

const identityTypes = require('./identity-types');
const users = require('./users');
const accounts = require('./accounts');
const profiles = require('./profiles');
const transactionTypes = require('./transaction-types');

function main(db) {
    router.get('/identity-types', identityTypes(db).get);
    router.post('/identity-type', identityTypes(db).post);
    router.put('/identity-type/:id', identityTypes(db).put);
    router.delete('/identity-type/:id', identityTypes(db).remove);
  
    router.get('/users', users(db).get);
    router.get('/user/:id', users(db).getOne);
    router.post('/user', users(db).post);
    router.put('/user/:id', users(db).put);
    router.delete('/user/:id', users(db).remove);

    router.get('/accounts', accounts(db).get);
    router.get('/account/:id', accounts(db).getOne);
    router.post('/account', accounts(db).post);
    router.put('/account/:id', accounts(db).put);
    router.delete('/account/:id', accounts(db).remove);
    
    router.get('/profiles', profiles(db).get);
    router.get('/profile/:id', profiles(db).getOne);
  
    router.get('/transaction-types', transactionTypes(db).get);
    router.post('/transaction-type', transactionTypes(db).post);
    router.put('/transaction-type/:id', transactionTypes(db).put);
    router.delete('/transaction-type/:id', transactionTypes(db).remove);
  
    router.use('/transactions', require('./transactions')(db));

    return router;
}

module.exports = main;