function main(db) {
    async function get() {
        const result = await db.accounts.findMany({
            select: {
                id: true,
                bank_name: true,
                bank_account_number: true,
                balance: true,
                created_at: true
            }
        });

        await db.$disconnect();

        return result;
    }

    async function post(data) {
        let { user_id, bank_name, bank_account_number, balance } = data;

        balance = Number(balance)

        const result = await db.accounts.create({
            select: {
                id: true,
                bank_name: true,
                bank_account_number: true,
                balance: true,
                created_at: true
            },
            data: {
                user_id,
                bank_name,
                bank_account_number,
                balance
            }
        });

        await db.$disconnect();

        return result;
    }

    async function put(id, data) {
        let { user_id, bank_name, bank_account_number, balance } = data;

        if (typeof (balance) !== "undefined") {
            balance = Number(balance)
        }

        const result = await db.accounts.update({
            select: {
                id: true,
                bank_name: true,
                bank_account_number: true,
                balance: true,
                created_at: true
            },
            where: { id: id },
            data: {
                user_id,
                bank_name,
                bank_account_number,
                balance
            }
        });

        await db.$disconnect();

        return result;
    }

    async function remove(id) {
        const result = await db.accounts.delete({
            where: { id: id }
        });

        await db.$disconnect();

        return result;
    }

    async function getOne(id) {

        const result = await db.accounts.findUnique({
            select: {
                id: true,
                bank_name: true,
                bank_account_number: true,
                balance: true,
                created_at: true
            },
            where: { id: id }
        });

        await db.$disconnect();

        return result;
    }

    return { get, post, put, remove, getOne };
}

module.exports = main;