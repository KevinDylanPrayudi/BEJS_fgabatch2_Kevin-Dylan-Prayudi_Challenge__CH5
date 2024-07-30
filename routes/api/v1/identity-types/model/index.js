function main(db) {
    async function get() {
        const result = await db.identity_Types.findMany();

        result.forEach(element => {
            element.id = Number(element.id)
        });

        await db.$disconnect();

        return result;
    }

    async function post(data) {
        const { identity_type_name } = data;
        const result = await db.identity_Types.create({
            select: {
                identity_type_name: true
            },
            data: {
                identity_type_name
            }
        });
        await db.$disconnect();
        return result;
    }

    async function put(id, data) {
        id = Number(id);
        const result = await db.identity_Types.update({
            select: {
                identity_type_name: true
            },
            where: { id: id },
            data: data
        });

        await db.$disconnect();

        return result;
    }

    async function remove(id) {
        id = Number(id);
        result = await db.identity_Types.delete({
            where: { id: id }
        });

        await db.$disconnect();

        return result;
    }

    return { get, post, put, remove };
}

module.exports = main