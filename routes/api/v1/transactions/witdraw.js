const Prisma = require('@prisma/client');

const { validator } = require('./validator');
const model = require('./models/withdraw');

function main(db) {
    
    /**
     * @swagger
     * /transactions/withdraws/{id}:
     *   get:
     *     summary: Get transaction by account id
     *     security:
     *       - bearerAuth: []
     *     tags:
     *      - Transactions
     *     parameters:
     *      - name: id
     *        in: path
     *        required: true
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: please check the Schema tab for more details kind of response
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/get:withdraws'
     *                 - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/get:not-found'
     *       401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     *       404:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/NotFoundError'
     */
    
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

    /**
     * @swagger
     * /transactions/withdraw/:
     *   post:
     *     summary: Create transaction
     *     security:
     *       - bearerAuth: []
     *     tags:
     *      - Transactions
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: 'http://localhost:3000/public/json/requests/transaction.json#/post:withdraw'
     *     responses:
     *       201:
     *         description: Returns a mysterious string
     *         content:
     *           application/json:
     *             schema:
     *               $ref: 'http://localhost:3000/public/json/responses/transaction.json#/post:withdraw'
     *       400:
     *         description: please check the Schema tab for more details kind of response
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/post:withdraw:validation'
     *                 - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/post:withdraw:bad-request'
     *       401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     */
    
    async function post(req, res) {
        try {
            await validator().withdraw().validateAsync(req.body);
            const result = await model(db).post(req.body);

            if (result === null) {
                result = {
                    message: 'Data transaction is not found'
                }
            }
            
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
     * /transactions/withdraw/{id}:
     *   get:
     *     summary: Get transaction by id
     *     security:
     *       - bearerAuth: []
     *     tags:
     *      - Transactions
     *     parameters:
     *      - name: id
     *        in: path
     *        required: true
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: please check the schema for another responses of this status code
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/get:withdraw'
     *                 - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/get:not-found'
     *       401:
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