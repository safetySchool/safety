const Joi = require('@hapi/joi');

const jwt = require('../../helpers/jwt');

module.exports = [{
    method: 'POST',
    path: '/api/helpers/token',
    options: {
        validate: {
            payload: Joi.object().keys({
                obj: Joi.object().required()
            })
        },
        handler: async (request, h) => {
            try {
                const { obj } = request.payload;
                let token = await jwt.sign(obj);
                return { error: false, token };
            } catch (error) {
                console.log(error);
                return { error: true };
            }
        }
    }
}];
