const Joi = require('@hapi/joi');

const loginHandler = require('../../routesHandlers/loginHandler.js');

module.exports = [{
    method: 'GET',
    path: '/login',
    options: {
        auth: { mode: 'try' },
        handler: function (request, h) {
            if (request.auth.isAuthenticated) {
                return h.view('app/index');
            }
            return h.view('app/login', null, { layout: 'clean' });
        }
    }
}, {
    method: 'GET',
    path: '/logout',
    config: {
        handler: async function (request, h) {
            await request.cookieAuth.clear();
            return h.redirect('/');
        }
    }
}, {
    method: 'POST',
    path: '/login/validate',
    config: {
        handler: async function (request, h) {
            let global  = request.payload;
            await request.cookieAuth.set(global);
            return h.redirect('/');
        }
    }
}, {
    method: 'POST',
    path: '/login',
    config: {
        auth: false,
        handler: loginHandler,
        validate: {
            payload: Joi.object().keys({
                login: Joi.string().required(),
                password: Joi.string().required()
            })
        }
    }
}];
