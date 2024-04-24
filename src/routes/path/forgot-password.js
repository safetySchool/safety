const Joi = require('@hapi/joi');
const forgotPasswordHandler = require('../../routesHandlers/forgot-passwordHandler.js');

module.exports = [{
    method: 'GET',
    path: '/forgot-password',
    options: {
        auth: { mode: 'try' },
        handler: async function (request, h) {
            return h.view('app/forgot-password', null, { layout: 'clean' });
        }
    }
}, 
{
    method: 'POST',
    path: '/forgot-password/createToken',
    config: {
        auth: false,
        handler: forgotPasswordHandler,
        validate: {
            payload: Joi.object().keys({
                userId: Joi.string().required(),
            })
        }
    }
}
];
