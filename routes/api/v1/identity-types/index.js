const { Prisma } = require('@prisma/client');

const { validator} = require('./validator');
const model = require('./model');

function main(db) {
    async function get(req, res) {
        let result = await model(db).get();

        if (result === null) {
            result = {
                message: 'Data identity type is empty'
            }
        }
        res.status(200).json({
            status: 'success',
            message: 'data identity type successfully loaded',
            data: result
        });
    }

    async function post(req, res) {
        try {
            await validator().post().validateAsync(req.body);
            const result = await model(db).post(req.body);

            res.status(201).json({
                status: 'success',
                message: 'data identity type successfully created',
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

    async function put(req, res) {
        try {
            await validator().params().validateAsync({ id:req.params.id });
            await validator().put().validateAsync(req.body);
            const result = await model(db).put(req.params.id, req.body);

            res.status(202).json({
                status: 'success',
                message: 'data identity type successfully updated',
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
            res.status(500).json(err.message)
        }
    }

    async function remove(req, res) {
        try {
            await validator().params().validateAsync({ id:req.params.id })
            await model(db).remove(req.params.id);
            
            res.sendStatus(204);
        } catch (err) {
            if(err.isJoi) return res.status(400).json({
                status: 'fail',
                message: err.details[0].message
            });
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2003') {
                    return res.status(400).json({
                        status: 'fail',
                        message: 'The data is being used by another table'
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

    return { get, post, put, remove };
}

module.exports = main