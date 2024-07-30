function main(db) {
    async function get(id) {
        const result = await db.transactions.findMany({
            select: {
                id: true,
                amount: true,
                date: true,
                source_account_id: true,
                transaction_type: {
                    select: {
                        transaction_type_name: true
                    }
                }
            },
            relationLoadStrategy: 'join',
            where: {
                source_account_id: id,
                transaction_type: {
                    transaction_type_name: "withdraw"
                }
            }
        });

        await db.$disconnect();
        return result;
    }

    async function post(data) {
        const { amount, source_account_id, transaction_type_id } = data;

        const result = await db.$transaction(async (tx) => {

            const withdraw = await tx.accounts.update({
                where: {
                    id: source_account_id
                },
                data: {
                    balance: {
                        decrement: Number(amount)
                    }
                }
            })

            if (withdraw.balance < 0) {
                throw new Error('Insufficient balance');
            }

            const result = await tx.transactions.create({
                select: {
                    id: true,
                    amount: true,
                    date: true,
                    source_account_id: true,
                    transaction_type: {
                        select: {
                            transaction_type_name: true
                        }
                    }
                },
                data: {
                    amount: Number(amount),
                    source_account_id,
                    transaction_type_id: Number(transaction_type_id)
                }
            });
            return {
                account: withdraw,
                transaction: result
            }
        });

        await db.$disconnect();

        return result;
    }

    async function getOne(id) {
        const result = await db.transactions.findFirst({
            select: {
                id: true,
                amount: true,
                date: true,
                source_account_id: true,
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
                    transaction_type_name: "withdraw"
                }
            }
        });

        await db.$disconnect();
        return result;
    }

    return { get, post, getOne };
}

module.exports = main