const { Prisma } = require('@prisma/client');

const { validator } = require('./validator');
const model = require('./model');

function main(db) {

    /**
     * @swagger
     * /users:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     tags:
     *      - Users
     *     responses:
     *       200:
     *         content:
     *           application/json:
     *             schema:
*                  $ref: 'http://localhost:3000/public/json/responses/users.json#/get-all'
     *       401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     *      
     */
    async function get(req, res) {
        let result = await model(db).get();

        if (result === null) {
            result = {
                message: 'Data users is empty'
            }
        }

        res.status(200).json({
            status: 'success',
            message: 'data users successfully loaded',
            data: result
        });
    }

    /** 
    * @swagger
    * /user:
    *   post:
    *     tags:
    *      - Users
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: 'http://localhost:3000/public/json/requests/users.json#/post'
    *     responses:
    *       201:
    *         content:
    *           application/json:
    *             schema:
    *               $ref: 'http://localhost:3000/public/json/responses/users.json#/post'
    *       400:
    *         description: Bad request or validation error. please check schema to get more details kind of error
    *         content:
    *           plain/text:
    *             schema:
    *               oneOf:
    *                 - type: string
    *                   example: 'email already exists'
    *                 - type: string
    *                   example: 'identity number not exists'
    *                 - type: string
    *                   example: '"name" is required'
    *                 - type: string
    *                   example: '"email" is required'
    *                 - type: string
    *                   example: '"password" is required'
    *                 - type: string
    *                   example: '"identity_type_id" is required'
    *                 - type: string
    *                   example: '"identity_number" is required'
    *                 - type: string
    *                   example: '"address" is required'
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
                status: 'success',
                message: 'data user successfully created',
                data: result
            });
        } catch (err) {
            if (err.isJoi) return res.status(400).send(err.details[0].message);
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    return res.status(400).json(`${err.meta.target[0]} already exists`);
                } else if (err.code === 'P2003') {
                    return res.status(400).json('Identity number not exists');
                }
                return res.status(400).json(err.meta.cause);
            }
            res.status(500).json(err.message)
        }
    }

    /**
    * @swagger
    * /user/{id}:
    *   put:
    *     tags: 
    *      - Users
    *     security:
    *       - bearerAuth: []
    *     parameters:
    *       - in: path
    *         name: id
    *         schema:
    *           type: string
    *         required: true
    *         description: User ID
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: 'http://localhost:3000/public/json/requests/users.json#/put'
    *     responses:
    *       202:
    *         content:
    *           application/json:
    *             schema:
    *               $ref: 'http://localhost:3000/public/json/responses/users.json#/put'
    *       400:
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: string
    *                 message:
    *                   type: string
    *       401:
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/responses/UnauthorizedError'
    */

    async function put(req, res) {
        try {
            await validator().put().validateAsync(req.body)
            const result = await model(db).put(req.params.id, req.body);

            res.status(202).json({
                status: 'success',
                message: 'data user successfully updated',
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
                } else if (err.code === 'P2003') {
                    return res.status(400).json({
                        status: 'fail',
                        message: 'Identity number not exists'
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

    /**
     * @swagger
     * /user/{id}:
     *   delete:
     *     security:
     *       - bearerAuth: []
     *     tags:
     *      - Users
     *     parameters:
     *       - in: path
     *         name: id
     *         description: User id
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       204:
     *         description: User deleted successfully
     *       400:
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                 message:
     *                   type: string
     *       401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     */
    async function remove(req, res) {
        try {
            await model(db).remove(req.params.id);

            res.sendStatus(204);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).json({
                status: 'fail',
                message: err.meta.cause
            });
            res.status(500).json({
                status: 'fail',
                message: err.message
            })
        }
    }

    /**
     * @swagger
     * /user/{id}:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: User ID
     *         schema:
     *           type: string
     *         required: true
     *     tags:
     *      - Users
     *     responses:
     *       200:
     *         description: A user account. please check the Schema tab for more details kind of response
     *         content:
     *           application/json:
     *             schema:
     *              oneOf:
     *                  - $ref: 'http://localhost:3000/public/json/responses/users.json#/get-one'
     *                  - $ref: 'http://localhost:3000/public/json/responses/users.json#/get:not-found'
     *       401:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/UnauthorizedError'
     *      
     */

    async function getOne(req, res) {
        try {
            let result = await model(db).getOne(req.params.id);

            if (result === null) {
                result = {
                    message: 'Data user is not found'
                }
            }

            res.status(200).json({
                status: 'success',
                message: 'data user successfully loaded',
                data: result
            });
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).json({
                status: 'fail',
                message: err.meta.cause
            });
            res.status(500).json({
                status: 'fail',
                message: err.message
            })
        }
    }

    return { get, post, put, remove, getOne };
}

module.exports = main