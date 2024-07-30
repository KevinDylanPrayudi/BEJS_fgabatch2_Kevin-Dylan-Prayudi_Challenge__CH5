const { Prisma } = require('@prisma/client');

const { validator } = require('./validator');
const model = require('./model');

function main(db) {
    async function get(req, res) {
        let result = await model(db).get();

        if (result === null) {
            result = {
                message: 'Data profile is empty'
            }
        }

        res.status(200).json({
            status: 'success',
            message: 'data profile successfully loaded',
            data: result
        });
    }

    async function getOne(req, res) {
        try {
            await validator().params().validateAsync({ id:req.params.id })
            let result = await model(db).getOne(req.params.id);
            
            if (result === null) {
                result = {
                    message: 'Data profile is not found'
                }
            }
            
            res.status(200).json({
                status: 'success',
                message: 'data profile successfully loaded',
                data: result
            });
        } catch (err) {
            if(err.isJoi) return res.status(400).json({
                status: 'fail',
                message: err.details[0].message
            });
            if(err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).json({
                status: 'fail',
                message: err.meta.cause
            });
            res.status(500).json({
                status: 'fail',
                message: err.message
            })
        }
    }

    return { get, getOne };
}

module.exports = main