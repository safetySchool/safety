const Joi = require('@hapi/joi');

const RoleController = require('../../controllers/roles');

module.exports = [{
    method: 'GET',
    path: '/api/roles',
    options: {
        auth: false,
        handler: RoleController.list
    }
}, {
    method: 'GET',
    path: '/api/roles/datatables',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0)
            })
        },
        handler: RoleController.list
    }
}, {
    method: 'GET',
    path: '/api/roles/{id}',
    options: {
        validate: {
            params: Joi.object().keys({
                id: Joi.string().required()
            })
        },
        handler: RoleController.get
    }
}, {
    method: 'POST',
    path: '/api/roles',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                name: Joi.string().required(),
                permissions: Joi.array().optional(),
                active: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: RoleController.create
    }
}, {
    method: 'PATCH',
    path: '/api/roles',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                _id: Joi.string().required(),
                name: Joi.string().required(),
                permissions: Joi.array().optional(),
                active: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: RoleController.update
    }
}];
