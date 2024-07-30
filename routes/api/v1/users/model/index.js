function main(db) {

    async function get() {
        // const result = await db.users.findMany({
        //     select: {
        //         id: true,
        //         name: true,
        //         email: true
        //     }
        // });

        const result = await db.userInfo.findMany()
        await db.$disconnect();

        return result;
    }

    async function post(data) {
        const { name, email, password, identity_type_id, identity_number, address } = data;
        const result = await db.users.create({
            select: {
                id: true,
                name: true,
                email: true,
                profile: {
                    select: {
                        identity_number: true,
                        address: true
                    }
                }
            },
            data: {
                name,
                email,
                password,
                profile: {
                    create: {
                        identity_type_id,
                        identity_number,
                        address
                    }
                }
            }
        });
        await db.$disconnect();

        return result;
    }

    async function put(id, data) {
        const { name, email, password, identity_type_id, identity_number, address } = data;
            const result = await db.users.update({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profile: {
                        select: {
                            identity_number: true,
                            address: true
                        }
                    }
                },
                data: {
                    name,
                    email,
                    password,
                    profile: {
                        update: {
                            identity_type_id,
                            identity_number,
                            address
                        }
                    }
                },
                where: { id: id }
            });

            await db.$disconnect();

            return result;
    }
    async function remove(id) {
        const result = await db.users.delete({
            where: { id: id }
        });

        await db.$disconnect();

        return result;
    }
    async function getOne(id) {
        // const result = await db.users.findUnique({
        //     select: {
        //         id: true,
        //         name: true,
        //         email: true
        //     },
        //     where: { id: id }
        // });
        const result = await db.userInfo.findFirst({
            where: { id: id }
        })

        await db.$disconnect();

        return result;
    }

    return { get, post, put, remove, getOne };
}

module.exports = main