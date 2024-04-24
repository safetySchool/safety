const Joi = require('@hapi/joi');

const PermissionController = require('../../controllers/permissions');

module.exports = [{
    method: 'GET',
    path: '/api/permissions',
    options: {
        auth: false,
        handler: PermissionController.list
    }
}, {
    method: 'GET',
    path: '/api/permissions/datatables',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0)
            })
        },
        handler: PermissionController.list
    }
}, {
    method: 'GET',
    path: '/api/permissions/{id}',
    options: {
        validate: {
            params: Joi.object().keys({
                id: Joi.string().required()
            })
        },
        handler: PermissionController.get
    }
}, {
    method: 'POST',
    path: '/api/permissions',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                module: Joi.string().required(),
                action: Joi.string().required(),
                description: Joi.string().required(),
                active: Joi.boolean().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: PermissionController.create
    }
}, {
    method: 'PATCH',
    path: '/api/permissions',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                _id: Joi.string().required(),
                module: Joi.string().optional(),
                action: Joi.string().optional(),
                description: Joi.string().optional(),
                active: Joi.boolean().optional()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: PermissionController.update
    },
}, {
    method: 'DELETE',
    path: '/api/permissions/{id}',
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
        handler: PermissionController.remove
    }
}];
