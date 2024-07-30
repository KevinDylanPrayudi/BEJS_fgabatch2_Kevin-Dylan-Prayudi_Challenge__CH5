const Prisma = require('@prisma/client');

function main(db) {
    
    async function get(id) {
        const result = await db.transactions.findMany({
            select: {
                id: true,
                amount: true,
                date: true,
                destination_account_id: true,
                transaction_type: {
                    select: {
                        transaction_type_name: true
                    }
                }
            },
            relationLoadStrategy: 'join',
            where: {
                destination_account_id: id,
                transaction_type: {
                    transaction_type_name: "deposit"
                }
            }
        });
        await db.$disconnect();

        return result;
    }

    async function post(data) {
        const { amount, destination_account_id, transaction_type_id } = data;
            const result = await db.$transaction(
                [
                    db.transactions.create({
                        select: {
                            id: true,
                            amount: true,
                            date: true,
                            destination_account_id: true,
                            transaction_type: {
                                select: {
                                    transaction_type_name: true
                                }
                            }
                        },
                        data: {
                            amount: Number(amount),
                            destination_account_id,
                            transaction_type_id: Number(transaction_type_id)
                        }
                    }),
                    db.accounts.update({
                        where: {
                            id: destination_account_id
                        },
                        data: {
                            balance: {
                                increment: Number(amount)
                            }
                        }
                    })
                ],
                {
                    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
                }
            );

            await db.$disconnect();

            return result;
    }

    async function getOne(id) {
        const result = await db.transactions.findFirst({
            select: {
                id: true,
                amount: true,
                date: true,
                destination_account_id: true,
                transaction_type: {
                    select: {
                        transaction_type_name: true
                    }
                }
            },
            relationLoadStrategy: 'join',
            where: {
                id: id,
                transaction_type: {
                    transaction_type_name: "deposit"
                }
            }
        });
        await db.$disconnect();

        return result;
    }

    return { get, post, getOne };
}

module.exports = main