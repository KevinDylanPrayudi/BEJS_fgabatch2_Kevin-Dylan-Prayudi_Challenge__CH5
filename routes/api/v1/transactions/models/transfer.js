function main(db) {
    async function sender(id) {
        // const result = await db.transactions.findMany({
        //     select: {
        //         id: true,
        //         amount: true,
        //         date: true,
        //         source_account_id: true,
        //         transaction_type: {
        //             select: {
        //                 transaction_type_name: true
        //             }
        //         }
        //     },
        //     relationLoadStrategy: 'join',
        //     where: {
        //         source_account_id: id,
        //         transaction_type: {
        //             transaction_type_name: "transfer"
        //         }
        //     }
        // })
        const result = await db.senders.findMany({
            where: {
                source_account_id: id
            }
        })

        await db.$disconnect();
        return result;
    }

    async function recepient(id) {
        // const result = await db.transactions.findMany({
        //     select: {
        //         id: true,
        //         amount: true,
        //         date: true,
        //         destination_account_id: true,
        //         transaction_type: {
        //             select: {
        //                 transaction_type_name: true
        //             }
        //         }
        //     },
        //     relationLoadStrategy: 'join',
        //     where: {
        //         destination_account_id: id,
        //         transaction_type: {
        //             transaction_type_name: "transfer"
        //         }
        //     }
        // })

        const result = await db.recepients.findMany({
            where: {
                destination_account_id: id
            }
        })

        await db.$disconnect();
        return result;
    }

    async function post(data) {
        const { amount, source_account_id, destination_account_id, transaction_type_id } = data;
            const result = await db.$transaction(async (tx) => {
                const sender = await tx.accounts.update({
                    where: {
                        id: source_account_id
                    },
                    data: {
                        balance: {
                            decrement: Number(amount)
                        }
                    }
                });

                if(sender.balance < 0) {
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
                        destination_account_id,
                        transaction_type_id: Number(transaction_type_id)
                    }
                })

                const recepient = await tx.accounts.update({
                    where: {
                        id: destination_account_id
                    },
                    data: {
                        balance: {
                            increment: Number(amount)
                        }
                    }
                })

                return {
                    sender,
                    recepient,
                    transaction: result
                };
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
                destination_account_id: true,
                transaction_type: {
                    select: {
                        transaction_type_name: true
                    }
                }
            },
            where: {
                id: id
            }
        })

        await db.$disconnect();
        return result;
    }

    return { sender, recepient, post, getOne }
}

module.exports = main