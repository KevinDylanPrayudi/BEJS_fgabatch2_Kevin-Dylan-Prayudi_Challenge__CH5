const Prisma = require('@prisma/client');

const { validator } = require('./validator');
const model = require('./models/deposit');

function main(db) {
    
    /**
     * @swagger
     * /transactions/deposits/{id}:
     *   get:
     *     summary: Get an transactions by account id
     *     security:    
     *       - bearerAuth: []
     *     tags: 
     *       - Transactions
     *     parameters:
     *      - in: path
     *        name: id
     *        required: true
     *        description: account id
     *        schema:
     *          type: string
     *     responses:
     *      200:
     *         description: Get an transactions. please check the Schema tab for more details kind of response
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *               - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/get-all:deposits'
     *               - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/get:not-found'
     *      401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     */
    async function get(req, res) {
        let result = await model(db).get(req.params.id);


        if (result.length === 0) {
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

    /**
     * @swagger
     * /transactions/deposit:
     *   post:
     *     security:    
     *       - bearerAuth: []
     *     tags: 
     *       - Transactions
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: 'http://localhost:3000/public/json/requests/transaction.json#/post:deposit'
     *     responses:
     *      201:
     *         description: Get an account. please check the Schema tab for more details kind of response
     *         content:
     *           application/json:
     *             schema:
     *               $ref: 'http://localhost:3000/public/json/responses/transaction.json#/get-all:deposits'
     *      400:
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/post:deposit:validation'
     *                 - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/post:deposit:bad-request'
     *      401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     */
    
    async function post(req, res) {
        try {
            await validator().deposit().validateAsync(req.body)
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

    /**
     * @swagger
     * /transactions/deposit/{id}:
     *   get:
     *     summary: Get an transactions by transaction id
     *     security:    
     *       - bearerAuth: []
     *     tags: 
     *       - Transactions
     *     parameters:
     *      - in: path
     *        name: id
     *        required: true
     *        description: transaction id
     *        schema:
     *          type: string
     *     responses:
     *      200:
     *         description: Get an account. please check the Schema tab for more details kind of response
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *               - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/get-one:deposit'
     *               - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/get:not-found'
     *      401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     */
    
    async function getOne(req, res) {
        let result = await model(db).getOne(req.params.id);
        
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

    return { get, post, getOne };
}

module.exports = main