const Joi = require('joi');

module.exports = {
    validator: () => ({
        post: () => Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),    
            identity_type_id: Joi.number().required(),
            identity_number: Joi.string().required(),
            address: Joi.string().required()
        }),
        put: () => Joi.object({
            name: Joi.string(),
            email: Joi.string().email(),
            password: Joi.string(),
            identity_type_id: Joi.number(),
            identity_number: Joi.string(),
            address: Joi.string()
        })
    })
}