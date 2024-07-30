const Joi = require('joi');

module.exports = {
    validator: () => ({
        post: () => Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required()
        })
    })
}