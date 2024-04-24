const Joi = require('@hapi/joi');

const accidentMovement = require('../../controllers/accidentMovement');

module.exports = [{
    method: 'GET',
    path: '/api/accident_movement/datatables/{id}',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0)
            })
        },
        handler: accidentMovement.get
    }
}, {
    method: 'GET',
    path: '/api/accident_movement/{_id}',
    options: {
        validate: {
            params: Joi.object().keys({
                _id: Joi.string().required()
            }),
            failAction: async (request, h, error) => {
                return error;
            }
        },
        handler: accidentMovement.getById
    }
}, {
    method: 'GET',
    path: '/api/accident_movement/files/{_id}',
    options: {
        validate: {
            params: Joi.object().keys({
                _id: Joi.string().required()
            }),
            failAction: async (request, h, error) => {
                return error;
            }
        },
        handler: accidentMovement.getFilesById
    }
}, {
    method: 'GET',
    path: '/api/accident_movement/getDocuments',
    options: {
        validate: {
            query: Joi.object().keys({
                _id: Joi.string().required()
            }),
            failAction: async (request, h, error) => {
                console.log(error);
                if (error) {
                    throw error;
                }
            }
        },
        handler: accidentMovement.getFilesByActivitiesMovementId
    }
}, {
    method: 'GET',
    path: '/api/accident_movement/getLastMovementDate/{institution}/{referenceId}',
    options: {
        validate: {
            query: Joi.object().keys({
                institution: Joi.string().optional(),
                referenceId: Joi.string().optional()
            }),
            failAction: async (request, h, error) => {
                console.log(error);
                if (error) {
                    throw error;
                }
            }
        },
        handler: accidentMovement.getLastMovementDate
    }
}, {
    method: 'GET',
    path: '/api/accident_movement/getDocumentValidation/{institution}/{referenceId}',
    options: {
        validate: {
            query: Joi.object().keys({
                institution: Joi.string().optional(),
                referenceId: Joi.string().optional()
            }),
            failAction: async (request, h, error) => {
                console.log(error);
                if (error) {
                    throw error;
                }
            }
        },
        handler: accidentMovement.getActivitiesMovementValidation
    }
}, {
    method: 'POST',
    path: '/api/accident_movement',
    options: {
        validate: {
            payload: Joi.object().keys({
                referenceId: Joi.string().required(),
                typeDocument: Joi.string().required(),
                date: Joi.string().required(),
                reference: Joi.string().required(),
                institution: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                console.log('error api: ', err);
                if (err) {
                    throw err;
                }
            }
        },
        handler: accidentMovement.create
    }
}, {
    method: 'POST',
    path: '/api/accident_movement/upload',
    config: {
        payload: {
            allow: 'multipart/form-data',
            multipart: {output: 'stream'},
        },
    },
    handler: accidentMovement.upload
}, {
    method: 'PATCH',
    path: '/api/accident_movement',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                _id: Joi.string().required(),
                people: Joi.string().optional(),
                typeDocument: Joi.string().required(),
                date: Joi.string().required(),
                reference: Joi.string().required(),
                active: Joi.boolean().optional(),
                institution: Joi.string().optional(),
                validated: Joi.boolean().optional(),
                files: Joi.optional(),
            }),
            failAction: async (request, h, err) => {
                console.log('error api: ', err);
                if (err) {
                    throw err;
                }
            }
        },
        handler: accidentMovement.update
    }
}, {
    method: 'PATCH',
    path: '/api/accident_movement/updateDate',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                people: Joi.string().required(),
                date: Joi.string().required(),
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: accidentMovement.updateDate
    }
}, {
    method: 'DELETE',
    path: '/api/accident_movement',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                _id: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                console.log(err);
                if (err) {
                    throw err;
                }
            }
        },
        handler: accidentMovement.delete
    }
}, {
    method: 'POST',
    path: '/api/accident_movement/multipart',
    handler: accidentMovement.uploadActivitiesMovement,
    options: {
        validate: {
            payload: Joi.object().keys({
                files: Joi.required(),
                _id: Joi.string().required(),
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
