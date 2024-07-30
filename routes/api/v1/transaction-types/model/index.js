function main(db) {

    async function get() {
        const result = await db.transaction_Types.findMany();
        result.forEach(element => {
            element.id = Number(element.id)
        });

        await db.$disconnect();

        return result;
    }
    async function post(data) {
        const result = await db.transaction_Types.create({
            select: {
                transaction_type_name: true
            },
            data: data
        });

        await db.$disconnect();
        return result;
    }

    async function put(id, data) {
        id = Number(id);
        const result = await db.transaction_Types.update({
            select: {
                transaction_type_name: true
            },
            where: { id : id },
            data: data
        });
        await db.$disconnect();
        return result;
    }

    async function remove(id) {
        id = Number(id);
        const result = await db.transaction_Types.delete({
            where: { id : id }
        });
        await db.$disconnect();
        return result;
    }

    return { get, post, put, remove };
}

module.exports = main;