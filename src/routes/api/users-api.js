const Joi = require('@hapi/joi');


const UserController = require('../../controllers/users');

module.exports = [{
    method: 'GET',
    path: '/api/users',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0).optional()
            })
        },
        handler: UserController.list
    }
}, {
    method: 'GET',
    path: '/api/users/{id}',
    options: {
        validate: {
            params: Joi.object().keys({
                id: Joi.string().required()
            })
        },
        handler: UserController.get
    }
}, {
    method: 'GET',
    path: '/api/users-institutionName/{id}',
    options: {
        validate: {
            params: Joi.object().keys({
                id: Joi.string().required()
            })
        },
        handler: UserController.getInstitutionName
    }
}, {
    method: 'GET',
    path: '/api/users/{id}/password_verify',
    options: {
        validate: {
            params: Joi.object().keys({
                id: Joi.string().required()
            }),
            query: Joi.object().keys({
                password: Joi.string().required()
            })
        },
        handler: UserController.passwordVerify
    }
}, {
    method: 'GET',
    path: '/api/user/token/{token}',
    options: {
        auth: false,
        validate: {
            params: Joi.object().keys({
                token: Joi.string().optional()
            }),
            failAction: async (request, h, error) => {
                return error;
            }
        },
        handler: UserController.getUserByToken
    }
}, {
    method: 'POST',
    path: '/api/users',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                login: Joi.string().required(),
                name: Joi.string().allow('').required(),
                lastname: Joi.string().allow('').required(),
                role: Joi.string().required(),
                institution: Joi.array().optional(),
                email: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: UserController.create
    }
}, {
    method: 'POST',
    path: '/api/users/newPassword',
    options: {
        handler: UserController.newPassword
    }
}, {
    method: 'PATCH',
    path: '/api/users',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                _id: Joi.string().required(),
                login: Joi.string().optional(),
                name: Joi.string().optional(),
                lastname: Joi.string().optional(),
                role: Joi.string().optional(),
                institution: Joi.array().optional(),
                email: Joi.string().optional(),
                password: Joi.string().optional(),
                active: Joi.boolean().optional(),
                token: Joi.string().optional().allow('')
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: UserController.update
    }
}, {
    method: 'PATCH',
    path: '/api/users/forgotPassword',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                _id: Joi.string().required(),
                login: Joi.string().optional(),
                name: Joi.string().optional(),
                lastname: Joi.string().optional(),
                role: Joi.string().optional(),
                institution: Joi.array().optional(),
                email: Joi.string().optional(),
                password: Joi.string().optional(),
                token: Joi.string().optional(),
                active: Joi.boolean().optional()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: UserController.updateForgotPassword
    }
}, {
    method: 'DELETE',
    path: '/api/users',
    options: {
        validate: {
            payload: Joi.object().keys({
                id: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: UserController.remove
    }
}];
