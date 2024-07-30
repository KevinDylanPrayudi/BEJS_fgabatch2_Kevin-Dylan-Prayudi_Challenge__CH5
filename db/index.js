const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
}).$extends({
    query: {
      users: {
        $allOperations({ operation, args, query }) {
          if (['create', 'update'].includes(operation) && args.data.password) {
            args.data.password = bcrypt.hashSync(args.data.password, 10)
          }
          return query(args)
        }
      }
    }
  });

module.exports = prisma;