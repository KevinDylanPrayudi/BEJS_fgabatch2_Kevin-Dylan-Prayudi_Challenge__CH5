const Joi = require('joi');

module.exports = {
    validator: () => ({
        params: () => Joi.object({
            id: Joi.number().required()
        })
    })
}