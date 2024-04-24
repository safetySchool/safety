const config = require('../config/');
//const validate = require('../helpers/validate-jwt');
const Boom = require('@hapi/boom');

exports.plugin = {
    name: 'jwtSeerver',
    version: '1.0.0',
    register: async function(server, options) {

        await server.register(require('hapi-auth-jwt2'));

        server.auth.strategy('jwt', 'jwt', {
            key: config.jwtSecret,
            tokenType: 'Bearer',
            verifyOptions: {
                ignoreExpiration: true,
                algorithms: ['HS256']
            },
            validate: function(decoded, request) {
                // ESTA VALIDACIÓN SE COMPROBARÁ CON LA DB MÁS ADELANTE
                if (decoded.company.name === 'ANASTASIA') {
                    return { isValid: true };
                }
                return { isValid: false };
            },
            errorFunc: ({ message }) => {
                throw Boom.unauthorized(message || 'Invalid or expired JWT');
            }
        });
    }
};
