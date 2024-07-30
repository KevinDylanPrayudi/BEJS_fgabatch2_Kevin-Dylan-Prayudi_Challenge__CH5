const Joi = require('joi');

module.exports = {
    validator: () => ({
        post: () => Joi.object({
            transaction_type_name: Joi.string().required()
        }),
        put: () => Joi.object({
            transaction_type_name: Joi.string()
        }),
        params: () => Joi.object({
            id: Joi.number().required()
        })
    })
}