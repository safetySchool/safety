// noinspection JSUnresolvedFunction

const Joi = require('@hapi/joi');
const generateHash = require('../../helpers/generatePassword');


const PeopleController = require('../../controllers/peoples');

module.exports = [{
    method: 'GET',
    path: '/api/people',
    options: {
        validate: {
            query: Joi.object().keys({
                type: Joi.string().required(),
                _: Joi.number().min(0).optional()
            })
        },
        handler: PeopleController.list
    }
}, {
    method: 'GET',
    path: '/api/people/{id}',
    options: {
        validate: {
            params: Joi.object().keys({
                id: Joi.string().required()
            })
        },
        handler: PeopleController.get
    }
}, {
    method: 'GET',
    path: '/api/people/getDocuments',
    options: {
        validate: {
            query: Joi.object().keys({
                id: Joi.string().required()
            })
        },
        handler: PeopleController.getDocuments
    }
}, {
    method: 'POST',
    path: '/api/people',
    options: {
        validate: {
            payload: Joi.object().keys({
                dni: Joi.string().required(),
                cargo: Joi.string().optional(),
                empresa: Joi.string().optional(),
                rut_empresa: Joi.string().required(),
                phone: Joi.number().required(),
                type: Joi.string().required(),
                name: Joi.string().allow('').required(),
                lastname: Joi.string().allow('').optional(),
                email: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: PeopleController.create
    }
}, {
    method: 'PATCH',
    path: '/api/people',
    options: {
        validate: {
            payload: Joi.object().keys({
                id: Joi.string().required(),
                dni: Joi.string().required(),
                cargo: Joi.string().optional(),
                empresa: Joi.string().optional(),
                rut_empresa: Joi.string().required(),
                phone: Joi.number().required(),
                name: Joi.string().allow('').required(),
                lastname: Joi.string().allow('').optional(),
                email: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: PeopleController.update
    }
}, {
    method: 'DELETE',
    path: '/api/people',
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
        handler: PeopleController.remove
    }
}, {
    method: 'POST',
    path: '/api/people/multipart',
    handler: PeopleController.uploadDocument,
    options: {
        validate: {
            payload: Joi.object().keys({
                files: Joi.required(),
                people: Joi.string().required(),
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
}, {
    method: 'POST',
    path: '/api/people/upload',
    handler: PeopleController.uploadDocument2,
    options: {
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
