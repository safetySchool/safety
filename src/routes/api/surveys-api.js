const Joi = require('@hapi/joi');


const SurveysController = require('../../controllers/surveys');

module.exports = [{
    method: 'GET',
    path: '/api/surveys',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0).optional()
            })
        },
        handler: SurveysController.list
    }
}, {
    method: 'GET',
    path: '/api/surveys/{id}',
    options: {
        validate: {
            params: Joi.object().keys({
                id: Joi.string().required()
            })
        },
        handler: SurveysController.get
    }
}, {
    method: 'POST',
    path: '/api/surveys',
    options: {
        auth: false,
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
        handler: SurveysController.create
    }
}, {
    method: 'PATCH',
    path: '/api/surveys',
    options: {
        validate: {
            payload: Joi.object().keys({
                id: Joi.string().required(),
                years: Joi.array().optional(),
                lastUpdate: Joi.string().optional(),
                closed: Joi.boolean().optional()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: SurveysController.update
    }
}, {
    method: 'DELETE',
    path: '/api/surveys',
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
        handler: SurveysController.close
    }
}];
