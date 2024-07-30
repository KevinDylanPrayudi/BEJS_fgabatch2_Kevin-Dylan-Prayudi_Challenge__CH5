const { Prisma } = require('@prisma/client');

const model = require('./model');
const { validator} = require('./validator');

function main(db) {
    async function post(req, res) {
        try {
            await validator().post().validateAsync(req.body);

            let result = await model(db).post(req.body);

            if (result === null) {
                return res.status(201).json({
                    status: 'success',
                    message: 'email or password is wrong'
                });
            }

            res.status(201).json({
                status: 'success',
                message: 'success login',
                data: result
            });
        } catch (err) {
            if (err.isJoi) return res.status(400).json({
                status: 'fail',
                message: err.details[0].message
            });
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    return res.status(400).json({
                        status: 'fail',
                        message: `${err.meta.target[0]} already exists`
                    });
                }
                return res.status(400).json({
                    status: 'fail',
                    message: err.meta.cause
                });
            }
            res.status(500).json({
                status: 'fail',
                message: err.message
            })
        }
    }

    return { post }
}

module.exports = main;