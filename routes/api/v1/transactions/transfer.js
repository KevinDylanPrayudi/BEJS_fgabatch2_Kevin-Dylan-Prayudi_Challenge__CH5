const Prisma = require('@prisma/client');

const { validator } = require('./validator');
const model = require('./models/transfer');

function main(db) {

    /**
     * 
     * @swagger
     * /transactions/transfers/sender/{id}:
     *   get:
     *     summary: Get an transactions sender's transfer by account id
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
     *               - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/get:transfers:sender'
     *               - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/get:not-found'
     *      401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     */

    async function sender(req, res) {
        let result = await model(db).sender(req.params.id);

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
     * 
     * @swagger
     * /transactions/transfers/recepient/{id}:
     *   get:
     *     summary: Get an transactions recepient's transfer by account id
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
     *               - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/get:transfers:recepient'
     *               - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/get:not-found'
     *      401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     */
    
    async function recepient(req, res) {
        let result = await model(db).recepient(req.params.id);

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
     * 
     * @swagger
     * /transactions/transfer/:
     *   post:
     *     summary: Create an transactions
     *     security:    
     *       - bearerAuth: []
     *     tags: 
     *       - Transactions
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: 'http://localhost:3000/public/json/requests/transaction.json#/post:transfer'
     *     responses:
     *      201:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: 'http://localhost:3000/public/json/responses/transaction.json#/post:transfer'
     *      400:
     *         description: Validation error & bad request. please check the Schema tab for more details kind of response
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *               - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/post:transfer:validation'
     *               - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/post:transfer:bad-request'
     *      401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     */
    
    async function post(req, res) {

        try {
            await validator().transfer().validateAsync(req.body)
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
                    let name;
                    if (err.meta.field_name == 'Transactions_transaction_type_id_fkey (index)'){
                        name = 'transaction_type_id';
                    } else if (err.meta.field_name == 'Transactions_destination_account_id_fkey (index)') {
                        name = 'destination_account_id';
                    }

                    return res.status(400).json({
                        status: "fail",
                        message: `The ${name} doesn't exists in other table.`,
                    });
                }

                if (err.code === 'P2025') {
                    return res.status(400).json({
                        status: "fail",
                        message: `The source_account_id doesn't exists in other table.`
                    });
                }

                return res.status(400).json({
                    status: "fail",
                    message: err.meta.cause
                });
            }
            res.status(400).json({
                status: "fail",
                message: err.message
            });
        }
    }

    /**
     * 
     * @swagger
     * /transactions/transfer/{id}:
     *   get:
     *     summary: Get an transactions by transaction's    id
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
     *              oneOf:
     *               - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/get:transfer'
     *               - $ref: 'http://localhost:3000/public/json/responses/transaction.json#/get:not-found'
     *      401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     *
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

    return { sender, recepient, post, getOne }
}

module.exports = main