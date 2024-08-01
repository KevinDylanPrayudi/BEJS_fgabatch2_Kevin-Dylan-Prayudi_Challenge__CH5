const { Prisma } = require('@prisma/client');

const { validator } = require('./validator');
const model = require('./model');

function main(db) {
    
    /**
     * 
     * @swagger
     * /transaction-types:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     tags:
     *      - Transaction Types
     *     responses:
     *       200:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: 'http://localhost:3000/public/json/responses/transaction-types.json#/get:transaction-types'
     *       401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     */
    
    async function get(req, res) {
        let result = await model(db).get();

        if (result === null) {
            result = {
                message: 'Data transaction type is empty'
            }
        }
        res.status(200).json({
            status: "success",
            message: "data transaction type successfully loaded",
            data: result
        });
    }
    
    /**
     * 
     * @swagger
     * /transaction-type:
     *   post:
     *     security:
     *       - bearerAuth: []
     *     tags:
     *      - Transaction Types
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: 'http://localhost:3000/public/json/requests/transaction-types.json#/post:transaction-type'
     *     responses:
     *       201:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: 'http://localhost:3000/public/json/responses/transaction-types.json#/post:transaction-type'
     *       400:
     *         description: Please check schema tab for kind of error
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: 'http://localhost:3000/public/json/responses/transaction-types.json#/post:transaction-type:validation'
     *                 - $ref: 'http://localhost:3000/public/json/responses/transaction-types.json#/post:transaction-type:bad-request'
     *       401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     */
    
    async function post(req, res) {
        try {
            await validator().post().validateAsync(req.body)
            const result = await model(db).post(req.body);
            
            res.status(201).json({
                status: "success",
                message: "data transaction type successfully created",
                data: result
            });
        } catch (err) {
            if(err.isJoi) return res.status(400).json({
                status: "fail",
                message: err.details[0].message
            });
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    return res.status(400).json({
                        status: "fail",
                        message: `${err.meta.target[0]} already exists`
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
     *
     * @swagger
     * /transaction-type/{id}:
     *   put:
     *     security:
     *       - bearerAuth: []
     *     tags:
     *      - Transaction Types
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID of transaction type
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: 'http://localhost:3000/public/json/requests/transaction-types.json#/post:transaction-type'
     *     responses:
     *       202:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: 'http://localhost:3000/public/json/responses/transaction-types.json#/post:transaction-type'
     *       400:
     *         description: Please check schema tab for kind of error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: 'http://localhost:3000/public/json/responses/transaction-types.json#/post:transaction-type:bad-request'
     *       401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     */
    
    async function put(req, res) {
        try {
            await validator().params().validateAsync({ id:req.params.id })
            await validator().put().validateAsync(req.body)
            const result = await model(db).put(req.params.id, req.body);
            
            res.status(202).json({
                status: "success",
                message: "data transaction type successfully updated",
                data: result
            });
        } catch (err) {
            if(err.isJoi) return res.status(400).json({
                status: "fail",
                message: err.details[0].message
            });
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    return res.status(400).json({
                        status: "fail",
                        message: `${err.meta.target[0]} already exists`
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
     *
     * @swagger
     * /transaction-type/{id}:
     *   delete:
     *     security:
     *       - bearerAuth: []
     *     tags:
     *      - Transaction Types
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID of transaction type
     *     responses:
     *       204:
     *         description: Transaction type deleted successfully
     *       400:
     *         description: Please check schema tab for kind of error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: 'http://localhost:3000/public/json/responses/transaction-types.json#/post:transaction-type'
     *       401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     */
    
    async function remove(req, res) {
        try {
            await validator().params().validateAsync({ id:req.params.id })
            await model(db).remove(req.params.id);
            
            res.sendStatus(204);
        } catch (err) {
            if(err.isJoi) return res.status(400).json({
                status: "fail",
                message: err.details[0].message
            });
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2003') {
                    return res.status(400).json({
                        status: "fail",
                        message: 'The data is being used by another table'
                    });
                }
                return res.status(400).json({
                    status: "fail",
                    message: err.meta.cause
                });
            }
            res.status(500).json(err.message)
        }
    }

    return { get, post, put, remove };
}

module.exports = main