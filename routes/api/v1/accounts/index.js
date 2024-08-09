const { Prisma } = require('@prisma/client');

const model = require('./model');
const { validator } = require('./validator')

function main(db) {

    /**
    * @swagger
    * /accounts:
    *   get:
    *     security:
    *       - bearerAuth: []
    *     tags:
    *      - Accounts
    *     responses:
    *       200:
    *         content:
    *           application/json:
    *             schema:
    *               $ref: 'http://localhost:3000/public/json/responses/accounts.json#/get-all'
    *       401:
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/responses/UnauthorizedError'
    *      
    */
    async function get(req, res) {
        let result = await model(db).get();

        if (result.length === 0) {
            result = {
                message: 'Data accounts is empty'
            }
        }

        res.status(200).json({
            status: "success",
            message: "data accounts successfully loaded",
            data: result
        });
    }

    /**
    * @swagger
    * /account:
    *   post:
    *     security:
    *       - bearerAuth: []
    *     tags:
    *      - Accounts
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: 'http://localhost:3000/public/json/requests/accounts.json#/post'
    *     responses:
    *       201:
    *         content:
    *           application/json:
    *             schema:
    *               $ref: 'http://localhost:3000/public/json/responses/accounts.json#/post'
    *       400:
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: string
    *                   description: A identifier success or fail
    *                 message:
    *                   type: string
    *                   description: A message for response
    *       401:
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/responses/UnauthorizedError'
    *      
    */

    async function post(req, res) {
        try {
            await validator().post().validateAsync(req.body)

            const result = await model(db).post(req.body);

            res.status(201).json({
                status: "success",
                message: "data account successfully created",
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
                        message: `The ${err.meta.field_name} doesn't exists in other table.`,
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
    * /account/{id}:
    *   put:
    *     security:
    *       - bearerAuth: []
    *     tags:
    *      - Accounts
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         description: Numeric ID of the account
    *         schema:
    *           type: string
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: 'http://localhost:3000/public/json/requests/accounts.json#/put'
    *     responses:
    *       202:
    *         content:
    *           application/json:
    *             schema:
    *               $ref: 'http://localhost:3000/public/json/responses/accounts.json#/put'
    *       400:
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: string
    *                   description: A identifier success or fail
    *                 message:
    *                   type: string
    *                   description: A message for response
    *       401:
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/responses/UnauthorizedError'
    */

    async function put(req, res) {
        try {
            await validator().put().validateAsync(req.body);

            const result = await model(db).put(req.params.id, { ...req.body });

            res.status(202).json({
                status: "success",
                message: "data account successfully updated",
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
                        message: `The ${err.meta.field_name} doesn't exists in other table.`,
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
     * /account/{id}:
     *   delete:
     *     security:
     *       - bearerAuth: []
     *     tags:
     *      - Accounts
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: account ID
     *         schema:
     *           type: string
     *     responses:
     *       204:
     *         description: Delete an account
     *       400:
     *         content:
     *           application/json:
     *             schema:
     *              type: object
     *              properties:
     *                 status:
     *                   type: string
     *                   description: A identifier success or fail
     *                 message:
     *                   type: string
     *                   description: A message for response
     *       401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     */

    async function remove(req, res) {
        try {
            result = await model(db).remove(req.params.id);

            res.sendStatus(204);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).json({
                status: "fail",
                message: err.meta.cause
            });
            res.status(500).json({
                status: "fail",
                message: err.message
            })
        }
    }

    /**
     * @swagger
     * /account/{id}:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     tags:
     *      - Accounts
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Account ID
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Get an account. please check the Schema tab for more details kind of response
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                   - $ref: 'http://localhost:3000/public/json/responses/accounts.json#/get-one'
     *                   - $ref: 'http://localhost:3000/public/json/responses/accounts.json#/get:not-found'
     *       400:
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   description: A identifier success or fail
     *                 message:
     *                   type: string
     *                   description: A message for response
     *       401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     */
    async function getOne(req, res) {
        try {
            let result = await model(db).getOne(req.params.id);

            if (result === null) {
                result = {
                    message: 'Data account is not found'
                }
            }

            res.status(200).json({
                status: "success",
                message: "data account successfully loaded",
                data: result
            });
        } catch (err) {
            res.status(500).json({
                status: "fail",
                message: err.message
            })
        }
    }

    return { get, post, put, remove, getOne };
}

module.exports = main