const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const bcrypt = require('bcrypt')

async function main() {
  await prisma.$executeRaw`
    CREATE OR REPLACE VIEW "UserInfo" AS
      SELECT
        "Users".id,
        name,
        email,
        address,
        identity_type_name
    FROM
        "Users"
        LEFT JOIN "Profiles" ON "Users".id = user_id
        LEFT JOIN "Identity_Types" ON identity_type_id = "Identity_Types".id;`

  await prisma.$executeRaw`
  CREATE OR REPLACE VIEW Senders AS
    SELECT
      t1.id,
      email,
      name,
      bank_name,
      amount,
      "date",
      source_account_id
    FROM "Transactions" t1
    LEFT JOIN "Accounts" t2 ON t1.source_account_id = t2.id
    LEFT JOIN "Users" t3 ON t2.user_id = t3.id
    WHERE destination_account_id IS NOT NULL AND source_account_id IS NOT NULL;
    `

  await prisma.$executeRaw`
  CREATE OR REPLACE VIEW Recepients AS
    SELECT
      t1.id,
      email,
      name,
      bank_name,
      amount,
      "date",
      destination_account_id
    FROM "Transactions" t1
    LEFT JOIN "Accounts" t2 ON t1.destination_account_id = t2.id
    LEFT JOIN "Users" t3 ON t2.user_id = t3.id
    WHERE destination_account_id IS NOT NULL AND source_account_id IS NOT NULL;
    `

  await prisma.$executeRaw`
    TRUNCATE TABLE "Identity_Types", "Users", "Transaction_Types" RESTART IDENTITY CASCADE;
  `
}

async function identityTypes() {
  return await prisma.identity_Types.createMany({
    data: [
      {identity_type_name: "Admin" },
      {identity_type_name: "User" },
    ]
  })
}

async function transactionTypes() {
  return await prisma.transaction_Types.createMany({
    data: [
      {transaction_type_name: "deposit" },
      {transaction_type_name: "withdraw" },
      {transaction_type_name: "transfer" },
    ]
  })
}

async function users() {
  return await prisma.users.createMany({
    data: [
      {
        id: "1495c7ff-3eb4-4944-86f6-124ce7d1c365",
        name: "Abigail",
        email: "abigail@gmail.com",
        password: bcrypt.hashSync("abigail", 10)
      },
      {
        id: "55a42801-aa85-410a-8451-7bb57baadaaf",
        name: "John",
        email: "john@gmail.com",
        password: bcrypt.hashSync("john", 10)
      },
      {
        id: "8f4a2ab7-381d-4455-bb94-6cbb30652286",
        name: "Jane",
        email: "jane@gmail.com",
        password: bcrypt.hashSync("jane", 10)
      },
    ]
  })
}

async function profiles() {
  return await prisma.profiles.createMany({
    data: [
      {
        user_id: "1495c7ff-3eb4-4944-86f6-124ce7d1c365",
        identity_type_id: 1,
        identity_number: "123456789",
        address: "123 Main St"
      },
      {
        user_id: "55a42801-aa85-410a-8451-7bb57baadaaf",
        identity_type_id: 2,
        identity_number: "123456789",
        address: "124 Main St"
      },
      {
        user_id: "8f4a2ab7-381d-4455-bb94-6cbb30652286",
        identity_type_id: 2,
        identity_number: "123456789",
        address: "125 Main St"
      }
    ]
  })
}

async function accounts() {
  return await prisma.accounts.createMany({
    data: [
      {
        id: "27f8e130-79a4-4678-a540-a364692ed530",
        user_id: "1495c7ff-3eb4-4944-86f6-124ce7d1c365",
        bank_name: "Bank of America",
        bank_account_number: "123456789",
        balance: 1000
      },
      {
        id: "dedc86d4-08f6-4a7f-95db-cf35666aaf4e",
        user_id: "1495c7ff-3eb4-4944-86f6-124ce7d1c365",
        bank_name: "Chase",
        bank_account_number: "987654321",
        balance: 2000,
      },
      {
        id: "d24d869b-5de4-4960-8ea6-2908ea20c2f4",
        user_id: "55a42801-aa85-410a-8451-7bb57baadaaf",
        bank_name: "Chase",
        bank_account_number: "987654321",
        balance: 2000,
      },
      {
        id: "f818b1d2-6a7e-4063-9569-e5a918e3f742",
        user_id: "8f4a2ab7-381d-4455-bb94-6cbb30652286",
        bank_name: "Chase",
        bank_account_number: "987654321",
        balance: 2000,
      }
    ]
  })
}

async function transactions() {
  return await prisma.transactions.createMany({
    data: [
      {
        destination_account_id: "dedc86d4-08f6-4a7f-95db-cf35666aaf4e",
        amount: 500,
        transaction_type_id: 1
      },
      {
        source_account_id: "27f8e130-79a4-4678-a540-a364692ed530",
        amount: 500,
        transaction_type_id: 2
      },
      {
        source_account_id: "dedc86d4-08f6-4a7f-95db-cf35666aaf4e",
        destination_account_id: "d24d869b-5de4-4960-8ea6-2908ea20c2f4",
        amount: 500,
        transaction_type_id: 3
      },
      {
        source_account_id: "d24d869b-5de4-4960-8ea6-2908ea20c2f4",
        destination_account_id: "f818b1d2-6a7e-4063-9569-e5a918e3f742",
        amount: 100,
        transaction_type_id: 3
      },
      {
        source_account_id: "d24d869b-5de4-4960-8ea6-2908ea20c2f4",
        amount: 1000,
        transaction_type_id: 2
      }
    ]
  })
}

main()
  .then(identityTypes)
  .then(transactionTypes)
  .then(users)
  .then(profiles)
  .then(accounts)
  .then(transactions)
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })