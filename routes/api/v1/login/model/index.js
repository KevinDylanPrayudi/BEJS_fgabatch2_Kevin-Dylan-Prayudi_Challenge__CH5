const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()



function main(db) {
    async function post(data) {
        const result = await db.users.findUnique({
            where: {
                email: data.email
            }
        });

        if (result === null) {
            return null
        }

        if (await bcrypt.compare(data.password, result.password)) {
            const token = jwt.sign({ email: result.email }, process.env.SECRET, { expiresIn: "1d" });

            return { token}
        }
        return null
    }

    return { post }
}

module.exports = main