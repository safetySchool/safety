// noinspection JSUnresolvedFunction

const Joi = require('@hapi/joi');
const generateHash = require('../../helpers/generatePassword');


const AccidentController = require('../../controllers/accident');

module.exports = [{
    method: 'GET',
    path: '/api/accident',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0).optional()
            })
        },
        handler: AccidentController.list
    }
}, {
    method: 'GET',
    path: '/api/accident/{id}',
    options: {
        validate: {
            params: Joi.object().keys({
                id: Joi.string().required()
            })
        },
        handler: AccidentController.get
    }
}, {
    method: 'GET',
    path: '/api/accident/getDocuments',
    options: {
        validate: {
            query: Joi.object().keys({
                id: Joi.string().required()
            })
        },
        handler: AccidentController.getDocuments
    }
}, {
    method: 'GET',
    path: '/api/accident/listGroup',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0).optional()
            })
        },
        handler: AccidentController.listGroup
    }
}, {
    method: 'GET',
    path: '/api/accident/yearsByAccident',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0).optional()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: AccidentController.yearsByAccident
    }
}, {
    method: 'GET',
    path: '/api/accident/QuantityBySelectLostDays/{typeAccident}/{lostDaysYears}',
    options: {
        validate: {
            params: Joi.object().keys({
                _: Joi.number().min(0),
                typeAccident: Joi.string().required(),
                lostDaysYears: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: AccidentController.quantityBySelectLostDays
    }
}, {
    method: 'GET',
    path: '/api/accident/QuantityByAccidentName/{type}/{accidentYears}',
    options: {
        validate: {
            params: Joi.object().keys({
                _: Joi.number().min(0),
                type: Joi.string().required(),
                accidentYears: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: AccidentController.quantityByAccidentName
    }
}, {
    method: 'GET',
    path: '/api/accident/QuantityWorkAccidentCaseByYear/{year}',
    options: {
        validate: {
            params: Joi.object().keys({
                _: Joi.number().min(0),
                year: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: AccidentController.QuantityWorkAccidentCaseByYear
    }
}, {
    method: 'GET',
    path: '/api/accident/QuantitySchoolAccidentCaseByYear/{year}',
    options: {
        validate: {
            params: Joi.object().keys({
                _: Joi.number().min(0),
                year: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: AccidentController.QuantitySchoolAccidentCaseByYear
    }
}, {
    method: 'POST',
    path: '/api/accident',
    options: {
        validate: {
            payload: Joi.object().keys({
                dni: Joi.string().required(),
                dateUp: Joi.string().optional(),
                type: Joi.string().optional(),
                casuistry: Joi.string().optional(),
                date: Joi.string().optional(),
                cargo: Joi.string().optional(),
                days: Joi.number().required(),
                name: Joi.string().allow('').required(),
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: AccidentController.create
    }
}, {
    method: 'PATCH',
    path: '/api/accident',
    options: {
        validate: {
            payload: Joi.object().keys({
                id: Joi.string().required(),
                dni: Joi.string().required(),
                dateUp: Joi.string().optional(),
                type: Joi.string().optional(),
                casuistry: Joi.string().optional(),
                date: Joi.string().optional(),
                cargo: Joi.string().optional(),
                days: Joi.number().optional(),
                name: Joi.string().allow('').required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: AccidentController.update
    }
}, {
    method: 'DELETE',
    path: '/api/accident',
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
        handler: AccidentController.remove
    }
}, {
    method: 'POST',
    path: '/api/accident/multipart',
    handler: AccidentController.uploadDocument,
    options: {
        validate: {
            payload: Joi.object().keys({
                files: Joi.required(),
                accident: Joi.string().required(),
            })
        },
        payload: {
            timeout: false,
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data',
            maxBytes: 50000000,
            multipart: true
        }
    }
}];
