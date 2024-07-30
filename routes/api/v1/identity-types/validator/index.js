const Joi = require('joi');

module.exports = {
    validator: () => ({
        post: () => Joi.object({
            identity_type_name: Joi.string().required()
        }),
        put: () => Joi.object({
            identity_type_name: Joi.string().required()
        }),
        params: () => Joi.object({
            id: Joi.number().required()
        })
    })
}