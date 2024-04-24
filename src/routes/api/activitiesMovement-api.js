const Joi = require('@hapi/joi');

const activitiesMovement = require('../../controllers/activitiesMovement');

module.exports = [{
    method: 'GET',
    path: '/api/activities_movement/datatables/{id}',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0)
            })
        },
        handler: activitiesMovement.get
    }
}, {
    method: 'GET',
    path: '/api/activities_movement/{_id}',
    options: {
        validate: {
            params: Joi.object().keys({
                _id: Joi.string().required()
            }),
            failAction: async (request, h, error) => {
                return error;
            }
        },
        handler: activitiesMovement.getById
    }
}, {
    method: 'GET',
    path: '/api/activities_movement/files/{_id}',
    options: {
        validate: {
            params: Joi.object().keys({
                _id: Joi.string().required()
            }),
            failAction: async (request, h, error) => {
                return error;
            }
        },
        handler: activitiesMovement.getFilesById
    }
}, {
    method: 'GET',
    path: '/api/activities_movement/getDocuments',
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
        handler: activitiesMovement.getFilesByActivitiesMovementId
    }
}, {
    method: 'GET',
    path: '/api/activities_movement/getLastMovementDate/{institution}/{referenceId}',
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
        handler: activitiesMovement.getLastMovementDate
    }
}, {
    method: 'GET',
    path: '/api/activities_movement/getDocumentValidation/{institution}/{referenceId}',
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
        handler: activitiesMovement.getActivitiesMovementValidation
    }
}, {
    method: 'POST',
    path: '/api/activities_movement',
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
        handler: activitiesMovement.create
    }
}, {
    method: 'POST',
    path: '/api/activities_movement/upload',
    config: {
        payload: {
            allow: 'multipart/form-data',
            multipart: { output: 'stream' },
        },
    },
    handler: activitiesMovement.upload
}, {
    method: 'PATCH',
    path: '/api/activities_movement',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                _id: Joi.string().required(),
                activity: Joi.string().optional(),
                typeDocument: Joi.string().optional(),
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
        handler: activitiesMovement.update
    }
}, {
    method: 'PATCH',
    path: '/api/activities_movement/updateDate',
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
        handler: activitiesMovement.updateDate
    }
}, {
    method: 'DELETE',
    path: '/api/activities_movement',
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
        handler: activitiesMovement.delete
    }
}, {
    method: 'POST',
    path: '/api/activities_movement/multipart',
    handler: activitiesMovement.uploadActivitiesMovement,
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
