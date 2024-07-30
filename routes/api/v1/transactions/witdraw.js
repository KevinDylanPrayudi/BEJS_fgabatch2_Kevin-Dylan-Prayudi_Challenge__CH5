const Prisma = require('@prisma/client');

const { validator } = require('./validator');
const model = require('./models/withdraw');

function main(db) {
    
    async function get(req, res) {
        let result = await model(db).get(req.params.id);

        if (result === null) {
            result = {
                message: 'Data transaction is not found'
            }
        }
        
        res.status(200).json({
            status: "success",
            message: "transaction successfully loaded",
            data: result
        });
    }

    async function post(req, res) {
        try {
            await validator().withdraw().validateAsync(req.body);
            const result = await model(db).post(req.body);
            
            res.status(201).json({
                status: "success",
                message: "transaction successfully created",
                data: result
            });
        } catch (err) {
            if (err.isJoi) return res.status(400).json({
                status: "fail",
                message: err.details[0].message
            });
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2003') {
                    return res.status(400).json({
                        status: "fail",
                        message: `The ${err.meta.field_name == 'Transactions_transaction_type_id_fkey (index)' ? 'transaction_type_id' : 'source_account_id'} doesn't exists in other table.`
                    });
                }

                return res.status(400).json({
                    status: "fail",
                    message: err.meta.cause
                });
            }
            res.status(500).json({
                status: "fail",
                message: err.message
            })
        }
    }

    async function getOne(req, res) {
        const result = await model(db).getOne(req.params.id);
        
        res.status(200).json(result);
    }

    return { get, post, getOne };
}

module.exports = main