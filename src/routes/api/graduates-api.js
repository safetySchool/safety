const Joi = require('@hapi/joi');


const GraduatesController = require('../../controllers/graduates');

module.exports = [{
    method: 'GET',
    path: '/api/graduates',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0).optional()
            })
        },
        handler: GraduatesController.list
    }
},{
    method: 'GET',
    path: '/api/graduates/years/distinct',
    options: {
        handler: GraduatesController.getDistictYears
    }
}, {
    method: 'GET',
    path: '/api/graduates/{id}',
    options: {
        validate: {
            params: Joi.object().keys({
                id: Joi.string().required()
            })
        },
        handler: GraduatesController.get
    }
},{
    method: 'POST',
    path: '/api/graduates/years',
    options: {
        validate: {
            payload: Joi.object().keys({
                years: Joi.array().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: GraduatesController.getByYears
    }
}, {
    method: 'POST',
    path: '/api/graduates',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                course: Joi.string().required(),
                dni: Joi.string().required(),
                year: Joi.number().required(),
                phone: Joi.number().required(),
                name: Joi.string().allow('').required(),
                lastname: Joi.string().allow('').required(),
                email: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: GraduatesController.create
    }
}, {
    method: 'PATCH',
    path: '/api/graduates',
    options: {
        validate: {
            payload: Joi.object().keys({
                id: Joi.string().required(),
                course: Joi.string().required(),
                dni: Joi.string().required(),
                year: Joi.number().required(),
                phone: Joi.number().required(),
                name: Joi.string().allow('').required(),
                lastname: Joi.string().allow('').required(),
                email: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: GraduatesController.update
    }
}, {
    method: 'DELETE',
    path: '/api/graduates',
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
        handler: GraduatesController.remove
    }
}];
