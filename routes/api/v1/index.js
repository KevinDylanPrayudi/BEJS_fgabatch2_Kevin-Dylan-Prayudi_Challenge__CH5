const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const identityTypes = require('./identity-types');
const users = require('./users');
const accounts = require('./accounts');
const profiles = require('./profiles');
const transactionTypes = require('./transaction-types');

const AUTHENTICATION = require('../../../middlewares/authentication.middleware');
const {
  isAdmin,
  authorization
} = require('../../../middlewares/authorization.middleware');
const { response } = require('express');


const options = {
  definition: {
    openapi: '3.0.2',
    info: {
      title: 'Basic Banking System API',
      description: 'Basic Banking System API Documentation for Developers and Users to use.',
      version: '1.0.0',
    },
    tags: [
      {
        name: 'Login',
        description: 'Login routes',
      },
      {
        name: 'Users',
        description: 'User routes',
      },
      {
        name: 'Profiles',
        description: 'Profile routes',
      },
      {
        name: 'Accounts',
        description: 'Account routes',
      },
      {
        name: 'Transactions',
        description: 'Transaction routes',
      },
    ],
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Unauthorized',
          example: 'Unauthorized'
        }
      },
    },
  },
  apis: ['routes/api/v1/*/*.js'],
};

const openapiSpecification = swaggerJsdoc(options);

function main(db) {
  router.use('/login', require('./login')(db).post);
  router.post('/user', users(db).post);

  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

  router.use(AUTHENTICATION)
  
  router.use('/user/:id', authorization().user);
  router.get('/user/:id', users(db).getOne);
  router.put('/user/:id', users(db).put);
  router.delete('/user/:id', users(db).remove);

  router.post('/account', accounts(db).post);
  router.use('/account/:id', authorization().account);
  router.get('/account/:id', accounts(db).getOne);
  router.put('/account/:id', accounts(db).put);
  router.delete('/account/:id', accounts(db).remove);

  router.use('/profile/:id', authorization().profile);
  router.get('/profile/:id', profiles(db).getOne);

  router.use('/transactions', require('./transactions')(db));

  router.use(isAdmin);

  router.get('/identity-types', identityTypes(db).get);
  router.post('/identity-type', identityTypes(db).post);
  router.put('/identity-type/:id', identityTypes(db).put);
  router.delete('/identity-type/:id', identityTypes(db).remove);

  router.get('/transaction-types', transactionTypes(db).get);
  router.post('/transaction-type', transactionTypes(db).post);
  router.put('/transaction-type/:id', transactionTypes(db).put);
  router.delete('/transaction-type/:id', transactionTypes(db).remove);

  router.get('/users', users(db).get);

  router.get('/accounts', accounts(db).get);

  router.get('/profiles', profiles(db).get);

  return router;
}

module.exports = main;