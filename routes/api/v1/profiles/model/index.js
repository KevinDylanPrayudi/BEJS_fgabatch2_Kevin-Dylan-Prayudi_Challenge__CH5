function main(db) {

    async function get() {
        const result = await db.profiles.findMany({
            select: {
                identity_number: true,
                address: true
            }
        });

        await db.$disconnect();

        return result;
    }

    async function getOne(id) {
        id = Number(id);
        result = await db.profiles.findUnique({
            select: {
                identity_number: true,
                address: true
            },
            where: { id : id }
        });

        await db.$disconnect();

        return result;
    }

    return { get, getOne };
}

module.exports = main