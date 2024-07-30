const Joi = require('joi');

module.exports = {
    validator: () => ({
        post: () => Joi.object({
            user_id: Joi.string().required(),
            bank_name: Joi.string().required(),
            bank_account_number: Joi.string().required(),
            balance: Joi.number().required()
        }),
        put: () => Joi.object({
            user_id: Joi.string(),
            bank_name: Joi.string(),
            bank_account_number: Joi.string(),
            balance: Joi.number()
        })
    })
}