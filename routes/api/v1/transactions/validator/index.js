const Joi = require('joi');

module.exports = {
    validator: () => ({
        deposit:() => Joi.object({
            destination_account_id: Joi.string().required(),
            amount: Joi.number().greater(0).required(),
            transaction_type_id: Joi.number().required()
        }),
        withdraw:() => Joi.object({
            source_account_id: Joi.string().required(),
            amount: Joi.number().greater(0).required(),
            transaction_type_id: Joi.number().required()
        }),
        transfer:() => Joi.object({
            source_account_id: Joi.string().required(),
            destination_account_id: Joi.string().required(),
            amount: Joi.number().greater(0).required(),
            transaction_type_id: Joi.number().required()
        })
    })
}